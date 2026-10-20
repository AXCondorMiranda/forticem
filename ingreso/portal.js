import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.48.1/+esm";

const SUPABASE_URL = "https://xsakooaabjofoukdhoah.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_HLwKH-_vw5CQTvbC_thplQ_J0I9hS-z";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

const dom = {
  authView: document.querySelector("[data-auth-view]"),
  appView: document.querySelector("[data-app-view]"),
  loginForm: document.querySelector("[data-login-form]"),
  loginButton: document.querySelector("[data-login-button]"),
  loginMessage: document.querySelector("[data-login-message]"),
  logout: document.querySelector("[data-logout]"),
  connection: document.querySelector("[data-connection]"),
  userName: document.querySelector("[data-user-name]"),
  userRole: document.querySelector("[data-user-role]"),
  tabs: [...document.querySelectorAll("[data-tab]")],
  panels: [...document.querySelectorAll("[data-panel]")],
  noPermissions: document.querySelector("[data-no-permissions]"),
  productionDate: document.querySelector("[data-production-date]"),
  productionForm: document.querySelector("[data-production-form]"),
  productionProducts: document.querySelector("[data-production-products]"),
  productionMessage: document.querySelector("[data-production-message]"),
  productionSave: document.querySelector("[data-production-save]"),
  productionRecords: document.querySelector("[data-production-records]"),
  demoldingDate: document.querySelector("[data-demolding-date]"),
  demoldingForm: document.querySelector("[data-demolding-form]"),
  demoldingProducts: document.querySelector("[data-demolding-products]"),
  demoldingMessage: document.querySelector("[data-demolding-message]"),
  demoldingSave: document.querySelector("[data-demolding-save]"),
  demoldingRecords: document.querySelector("[data-demolding-records]"),
  overrideField: document.querySelector("[data-override-field]"),
  toast: document.querySelector("[data-toast]"),
};

const state = {
  session: null,
  profile: null,
  products: [],
  balances: new Map(),
  activeTab: null,
};

const permission = (name) =>
  state.profile?.role === "administrator" ||
  (Array.isArray(state.profile?.permissions) && state.profile.permissions.includes(name));

const canUseProduction = () => permission("view_production") || permission("record_production");
const canUseDemolding = () => permission("view_demolding") || permission("record_demolding");

function localDateValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function numberLabel(value) {
  return new Intl.NumberFormat("es-PE", { maximumFractionDigits: 3 }).format(Number(value) || 0);
}

function roleLabel(role) {
  return ({ administrator: "Administrador", sales: "Ventas", dispatch: "Despacho", client: "Cliente" })[role] || "Personal FORTICEM";
}

function errorLabel(error) {
  const message = String(error?.message || error || "No se pudo completar la operación.");
  if (/invalid login credentials/i.test(message)) return "El correo o la contraseña no son correctos.";
  if (/email not confirmed/i.test(message)) return "El correo aún no ha sido confirmado.";
  if (/failed to fetch|networkerror|load failed/i.test(message)) return "No hay conexión con el servidor. Revisa tu internet e inténtalo otra vez.";
  if (/permission|permiso|row-level security/i.test(message)) return "Tu cuenta no tiene permiso para realizar esta acción.";
  return message;
}

function setMessage(element, message = "", success = false) {
  element.textContent = message;
  element.classList.toggle("is-success", success);
  element.hidden = !message;
}

let toastTimer;
function showToast(message, error = false) {
  clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.toggle("is-error", error);
  dom.toast.hidden = false;
  toastTimer = setTimeout(() => { dom.toast.hidden = true; }, 4200);
}

function setBusy(button, busy, busyLabel) {
  if (!button.dataset.label) button.dataset.label = button.querySelector("span")?.textContent || button.textContent;
  const label = button.querySelector("span");
  if (label) label.textContent = busy ? busyLabel : button.dataset.label;
  button.disabled = busy;
}

function showLogin(message = "") {
  state.session = null;
  state.profile = null;
  state.products = [];
  dom.authView.hidden = false;
  dom.appView.hidden = true;
  dom.logout.hidden = true;
  setMessage(dom.loginMessage, message);
}

function productEntry(product, kind) {
  const article = document.createElement("article");
  article.className = "product-entry";

  const info = document.createElement("div");
  const code = document.createElement("span");
  code.className = "product-entry__code";
  code.textContent = product.code || "Producto";
  const name = document.createElement("strong");
  name.textContent = product.name;
  info.append(code, name);

  if (kind === "demolding") {
    const available = document.createElement("small");
    const pending = state.balances.get(product.id)?.pending_quantity || 0;
    available.textContent = `Pendiente: ${numberLabel(pending)} ${product.unit}`;
    info.append(available);
  }

  const label = document.createElement("label");
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "0.001";
  input.inputMode = "decimal";
  input.placeholder = "0";
  input.dataset.productId = product.id;
  input.dataset.kind = kind;
  input.setAttribute("aria-label", `Cantidad de ${product.name}`);
  const unit = document.createElement("span");
  unit.textContent = product.unit;
  label.append(input, unit);
  article.append(info, label);
  return article;
}

function renderProducts(kind) {
  const target = kind === "production" ? dom.productionProducts : dom.demoldingProducts;
  target.replaceChildren(...state.products.map((product) => productEntry(product, kind)));
}

function selectedEntries(kind) {
  const container = kind === "production" ? dom.productionProducts : dom.demoldingProducts;
  return [...container.querySelectorAll("input[data-product-id]")]
    .map((input) => ({ product: state.products.find((item) => item.id === input.dataset.productId), quantity: Number(input.value.replace(",", ".")) }))
    .filter((entry) => entry.product && Number.isFinite(entry.quantity) && entry.quantity > 0);
}

function clearQuantities(kind) {
  const target = kind === "production" ? dom.productionProducts : dom.demoldingProducts;
  target.querySelectorAll("input[data-product-id]").forEach((input) => { input.value = ""; });
}

function setActiveTab(tabName) {
  state.activeTab = tabName;
  dom.tabs.forEach((button) => {
    const active = button.dataset.tab === tabName;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  dom.panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== tabName; });
}

function configureWorkspace() {
  const productionTab = dom.tabs.find((item) => item.dataset.tab === "production");
  const demoldingTab = dom.tabs.find((item) => item.dataset.tab === "demolding");
  productionTab.hidden = !canUseProduction();
  demoldingTab.hidden = !canUseDemolding();
  dom.noPermissions.hidden = canUseProduction() || canUseDemolding();
  dom.productionSave.hidden = !permission("record_production");
  dom.demoldingSave.hidden = !permission("record_demolding");
  dom.overrideField.hidden = state.profile.role !== "administrator";

  const initialTab = canUseProduction() ? "production" : canUseDemolding() ? "demolding" : null;
  dom.panels.forEach((panel) => { panel.hidden = true; });
  if (initialTab) setActiveTab(initialTab);
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("id, code, name, unit, is_active")
    .eq("is_active", true)
    .order("name");
  if (error) throw error;
  state.products = data || [];
  renderProducts("production");
}

async function fetchBalances() {
  if (!canUseDemolding()) return;
  const { data, error } = await supabase.rpc("production_demolding_balance");
  if (error) throw error;
  state.balances = new Map((data || []).map((item) => [item.product_id, item]));
  renderProducts("demolding");
}

function renderRecords(target, rows, dateField) {
  target.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "records-empty";
    empty.textContent = `No hay registros para el ${new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${dateField.value}T00:00:00Z`))}.`;
    target.append(empty);
    return;
  }

  rows.forEach((row) => {
    const item = document.createElement("article");
    item.className = "record-row";
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = row.product_name;
    const detail = document.createElement("small");
    const time = row.created_at ? new Intl.DateTimeFormat("es-PE", { hour: "2-digit", minute: "2-digit" }).format(new Date(row.created_at)) : "";
    const extras = [time, row.batch_code ? `Lote ${row.batch_code}` : "", row.is_override ? "Excepción administrativa" : ""].filter(Boolean);
    detail.textContent = extras.join(" · ") || "Registro guardado";
    copy.append(name, detail);
    const quantity = document.createElement("span");
    quantity.textContent = `${numberLabel(row.quantity)} ${row.unit}`;
    item.append(copy, quantity);
    target.append(item);
  });
}

async function loadRecords(kind) {
  const isProduction = kind === "production";
  const target = isProduction ? dom.productionRecords : dom.demoldingRecords;
  const dateField = isProduction ? dom.productionDate : dom.demoldingDate;
  target.innerHTML = '<div class="loading-line" aria-label="Cargando"></div>';

  const table = isProduction ? "production_records" : "demolding_records";
  const dateColumn = isProduction ? "production_date" : "demolding_date";
  const columns = isProduction
    ? "id, product_name, unit, quantity, batch_code, notes, created_at"
    : "id, product_name, unit, quantity, notes, created_at, is_override";
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq(dateColumn, dateField.value)
    .order("created_at", { ascending: false });
  if (error) {
    target.replaceChildren();
    const message = document.createElement("p");
    message.className = "records-empty";
    message.textContent = errorLabel(error);
    target.append(message);
    return;
  }
  renderRecords(target, data || [], dateField);
}

async function openSession(session) {
  state.session = session;
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active, permissions")
    .eq("id", session.user.id)
    .single();
  if (error) throw error;
  if (!profile.is_active) {
    await supabase.auth.signOut({ scope: "local" });
    showLogin("Tu cuenta está desactivada. Comunícate con un administrador.");
    return;
  }

  state.profile = profile;
  dom.userName.textContent = profile.full_name || session.user.email?.split("@")[0] || "Trabajador";
  dom.userRole.textContent = roleLabel(profile.role);
  dom.authView.hidden = true;
  dom.appView.hidden = false;
  dom.logout.hidden = false;
  configureWorkspace();

  try {
    await fetchProducts();
    await Promise.all([
      canUseProduction() ? loadRecords("production") : Promise.resolve(),
      canUseDemolding() ? fetchBalances().then(() => loadRecords("demolding")) : Promise.resolve(),
    ]);
  } catch (loadError) {
    showToast(errorLabel(loadError), true);
  }
}

dom.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(dom.loginMessage);
  setBusy(dom.loginButton, true, "Verificando…");
  const form = new FormData(dom.loginForm);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") || "").trim(),
      password: String(form.get("password") || ""),
    });
    if (error) throw error;
    if (data.session) await openSession(data.session);
  } catch (error) {
    setMessage(dom.loginMessage, errorLabel(error));
  } finally {
    setBusy(dom.loginButton, false, "");
  }
});

dom.logout.addEventListener("click", async () => {
  dom.logout.disabled = true;
  await supabase.auth.signOut({ scope: "local" });
  dom.loginForm.reset();
  showLogin();
  dom.logout.disabled = false;
});

dom.tabs.forEach((button) => button.addEventListener("click", () => setActiveTab(button.dataset.tab)));

dom.productionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(dom.productionMessage);
  if (!permission("record_production")) return setMessage(dom.productionMessage, "Tu cuenta no tiene permiso para registrar producción.");
  const entries = selectedEntries("production");
  if (!entries.length) return setMessage(dom.productionMessage, "Ingresa al menos una cantidad mayor que cero.");
  const form = new FormData(dom.productionForm);
  const optional = (value) => String(value || "").trim() || null;
  const rows = entries.map(({ product, quantity }) => ({
    production_date: dom.productionDate.value,
    product_id: product.id,
    product_code: product.code,
    product_name: product.name,
    unit: product.unit,
    quantity,
    batch_code: optional(form.get("batchCode")),
    notes: optional(form.get("notes")),
    created_by: state.session.user.id,
  }));

  setBusy(dom.productionSave, true, "Guardando…");
  try {
    const { error } = await supabase.from("production_records").insert(rows);
    if (error) throw error;
    clearQuantities("production");
    dom.productionForm.elements.batchCode.value = "";
    dom.productionForm.elements.notes.value = "";
    setMessage(dom.productionMessage, `${rows.length} registro${rows.length === 1 ? "" : "s"} guardado${rows.length === 1 ? "" : "s"}.`, true);
    showToast("Producción guardada correctamente.");
    await Promise.all([loadRecords("production"), canUseDemolding() ? fetchBalances() : Promise.resolve()]);
  } catch (error) {
    setMessage(dom.productionMessage, errorLabel(error));
  } finally {
    setBusy(dom.productionSave, false, "");
  }
});

dom.demoldingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(dom.demoldingMessage);
  if (!permission("record_demolding")) return setMessage(dom.demoldingMessage, "Tu cuenta no tiene permiso para registrar desmolde.");
  const entries = selectedEntries("demolding");
  if (!entries.length) return setMessage(dom.demoldingMessage, "Ingresa al menos una cantidad mayor que cero.");
  const form = new FormData(dom.demoldingForm);
  const optional = (value) => String(value || "").trim() || null;
  const overrideReason = optional(form.get("overrideReason"));
  const hasExcess = entries.some(({ product, quantity }) => quantity > Number(state.balances.get(product.id)?.pending_quantity || 0));
  if (hasExcess && state.profile.role === "administrator" && (!overrideReason || overrideReason.length < 5)) {
    return setMessage(dom.demoldingMessage, "Indica un motivo de excepción de al menos 5 caracteres.");
  }

  setBusy(dom.demoldingSave, true, "Guardando…");
  try {
    const { error } = await supabase.rpc("record_demolding", {
      p_date: dom.demoldingDate.value,
      p_entries: entries.map(({ product, quantity }) => ({ product_id: product.id, quantity })),
      p_notes: optional(form.get("notes")),
      p_override_reason: overrideReason,
    });
    if (error) throw error;
    clearQuantities("demolding");
    dom.demoldingForm.elements.notes.value = "";
    if (dom.demoldingForm.elements.overrideReason) dom.demoldingForm.elements.overrideReason.value = "";
    setMessage(dom.demoldingMessage, `${entries.length} registro${entries.length === 1 ? "" : "s"} guardado${entries.length === 1 ? "" : "s"}.`, true);
    showToast("Desmolde guardado y stock actualizado.");
    await Promise.all([fetchBalances(), loadRecords("demolding")]);
  } catch (error) {
    setMessage(dom.demoldingMessage, errorLabel(error));
  } finally {
    setBusy(dom.demoldingSave, false, "");
  }
});

dom.productionDate.addEventListener("change", () => loadRecords("production"));
dom.demoldingDate.addEventListener("change", () => loadRecords("demolding"));
document.querySelector("[data-refresh-production]").addEventListener("click", () => loadRecords("production"));
document.querySelector("[data-refresh-demolding]").addEventListener("click", async () => { await fetchBalances(); await loadRecords("demolding"); });

function updateConnection() {
  const online = navigator.onLine;
  dom.connection.classList.toggle("is-offline", !online);
  dom.connection.lastChild.textContent = online ? " En línea" : " Sin conexión";
}
window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);
updateConnection();

dom.productionDate.value = localDateValue();
dom.demoldingDate.value = localDateValue();

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT" && !dom.authView.hidden) return;
  if (event === "SIGNED_OUT") showLogin("La sesión terminó. Vuelve a ingresar.");
});

const { data: { session } } = await supabase.auth.getSession();
if (session) {
  try { await openSession(session); }
  catch (error) {
    await supabase.auth.signOut({ scope: "local" });
    showLogin(errorLabel(error));
  }
} else {
  showLogin();
}
