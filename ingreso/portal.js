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
  ordersDate: document.querySelector("[data-orders-date]"),
  ordersSearch: document.querySelector("[data-orders-search]"),
  ordersStatus: document.querySelector("[data-orders-status]"),
  ordersAll: document.querySelector("[data-orders-all]"),
  ordersSummary: document.querySelector("[data-orders-summary]"),
  ordersMessage: document.querySelector("[data-orders-message]"),
  ordersList: document.querySelector("[data-orders-list]"),
  usersSearch: document.querySelector("[data-users-search]"),
  usersMessage: document.querySelector("[data-users-message]"),
  usersList: document.querySelector("[data-users-list]"),
  orderDialog: document.querySelector("[data-order-dialog]"),
  orderDialogTitle: document.querySelector("[data-order-dialog-title]"),
  orderDetail: document.querySelector("[data-order-detail]"),
  passwordDialog: document.querySelector("[data-password-dialog]"),
  passwordForm: document.querySelector("[data-password-form]"),
  passwordUser: document.querySelector("[data-password-user]"),
  passwordMessage: document.querySelector("[data-password-message]"),
  passwordSave: document.querySelector("[data-password-save]"),
  toast: document.querySelector("[data-toast]"),
};

const state = {
  session: null,
  profile: null,
  products: [],
  balances: new Map(),
  orders: [],
  users: [],
  ordersShowAll: false,
  selectedOrderId: null,
  ordersChannel: null,
  activeTab: null,
};

const permission = (name) =>
  state.profile?.role === "administrator" ||
  (Array.isArray(state.profile?.permissions) && state.profile.permissions.includes(name));

const canUseProduction = () => permission("view_production") || permission("record_production");
const canUseDemolding = () => permission("view_demolding") || permission("record_demolding");
const canUseDispatch = () => permission("view_orders");
const canManageUsers = () => permission("manage_users");

const orderStatuses = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "En preparación",
  ready_for_dispatch: "Listo para despacho",
  mobility_assigned: "Movilidad asignada",
  on_the_way: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

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
  if (/password should be at least|contraseña.*8/i.test(message)) return "La contraseña debe tener al menos 8 caracteres.";
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
  if (state.ordersChannel) {
    supabase.removeChannel(state.ordersChannel);
    state.ordersChannel = null;
  }
  state.session = null;
  state.profile = null;
  state.products = [];
  state.orders = [];
  state.users = [];
  if (dom.orderDialog.open) dom.orderDialog.close();
  if (dom.passwordDialog.open) dom.passwordDialog.close();
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
  const dispatchTab = dom.tabs.find((item) => item.dataset.tab === "dispatch");
  const usersTab = dom.tabs.find((item) => item.dataset.tab === "users");
  productionTab.hidden = !canUseProduction();
  demoldingTab.hidden = !canUseDemolding();
  dispatchTab.hidden = !canUseDispatch();
  usersTab.hidden = !canManageUsers();
  dom.noPermissions.hidden = canUseProduction() || canUseDemolding() || canUseDispatch() || canManageUsers();
  dom.productionSave.hidden = !permission("record_production");
  dom.demoldingSave.hidden = !permission("record_demolding");
  dom.overrideField.hidden = state.profile.role !== "administrator";

  const initialTab = canUseDispatch() && state.profile.role === "dispatch"
    ? "dispatch"
    : canUseProduction()
      ? "production"
      : canUseDemolding()
        ? "demolding"
        : canUseDispatch()
          ? "dispatch"
          : canManageUsers()
            ? "users"
            : null;
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

function relationObject(value) {
  return Array.isArray(value) ? value[0] || {} : value || {};
}

function normalizeOrder(row) {
  const client = relationObject(row.clients);
  const address = relationObject(row.client_addresses);
  return {
    ...row,
    client_name: client.name || "Cliente",
    client_phone: client.phone || "",
    district: address.city || "",
    address_line: address.address_line || "",
    order_items: (row.order_items || []).map((line) => ({
      ...line,
      order_item_codes: [...(line.order_item_codes || [])].sort((left, right) => left.code.localeCompare(right.code)),
    })),
  };
}

function dateFromTimestamp(value) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function scheduledDate(order) {
  return order.requested_date || dateFromTimestamp(order.created_at);
}

function orderIsOverdue(order) {
  return ["pending", "confirmed", "preparing"].includes(order.status) && scheduledDate(order) < localDateValue();
}

function orderWeight(order) {
  return order.order_items.reduce((total, line) => total + Number(line.quantity || 0) * Number(line.unit_weight_kg || 0), 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function visibleOrders() {
  const query = dom.ordersSearch.value.trim().toLowerCase();
  const status = dom.ordersStatus.value;
  const selectedDate = dom.ordersDate.value;
  const today = localDateValue();
  return state.orders
    .filter((order) => {
      if (!state.ordersShowAll) {
        const scheduledForDate = scheduledDate(order) === selectedDate;
        const carriedIntoToday = selectedDate === today && orderIsOverdue(order);
        if (!scheduledForDate && !carriedIntoToday) return false;
      }
      if (status && order.status !== status) return false;
      if (!query) return true;
      const searchable = [
        order.order_number,
        order.client_name,
        order.client_phone,
        order.district,
        order.address_line,
        order.registered_by_name,
        order.registered_by_email,
        ...order.order_items.map((line) => line.product_name),
        ...order.order_items.flatMap((line) => line.order_item_codes.map((code) => code.code)),
      ].filter(Boolean).join(" ").toLowerCase();
      return searchable.includes(query);
    })
    .sort((left, right) => {
      if (orderIsOverdue(left) !== orderIsOverdue(right)) return orderIsOverdue(left) ? -1 : 1;
      return scheduledDate(left).localeCompare(scheduledDate(right)) || new Date(right.created_at) - new Date(left.created_at);
    });
}

function statusChip(status) {
  const chip = document.createElement("span");
  chip.className = "status-chip";
  chip.dataset.status = status;
  chip.textContent = orderStatuses[status] || status;
  return chip;
}

function nextDispatchAction(order) {
  if (!permission("update_order_status")) return null;
  if (order.status === "confirmed") return { status: "preparing", label: "Iniciar preparación" };
  if (order.status === "preparing") return { status: "ready_for_dispatch", label: "Marcar pedido listo" };
  if (order.status === "ready_for_dispatch") return { status: "delivered", label: "Marcar como entregado" };
  return null;
}

async function transitionOrder(order, action, button) {
  const nextLabel = orderStatuses[action.status] || action.status;
  if (!window.confirm(`¿Actualizar ${order.order_number} a “${nextLabel}”?`)) return;
  button.disabled = true;
  try {
    const { error } = await supabase.rpc("transition_order", {
      p_order_id: order.id,
      p_next_status: action.status,
      p_comment: null,
    });
    if (error) throw error;
    showToast(`${order.order_number}: ${nextLabel}.`);
    await fetchOrders();
  } catch (error) {
    showToast(errorLabel(error), true);
    button.disabled = false;
  }
}

function renderOrders() {
  const orders = visibleOrders();
  dom.ordersList.replaceChildren();
  dom.ordersSummary.replaceChildren();

  const counts = [
    ["Visibles", orders.length],
    ["En preparación", orders.filter((item) => item.status === "preparing").length],
    ["Listos", orders.filter((item) => item.status === "ready_for_dispatch").length],
    ["Atrasados", orders.filter(orderIsOverdue).length],
  ];
  counts.forEach(([label, value]) => {
    const chip = document.createElement("span");
    chip.className = "summary-chip";
    chip.append(`${label}: `);
    const strong = document.createElement("strong");
    strong.textContent = value;
    chip.append(strong);
    dom.ordersSummary.append(chip);
  });

  if (!orders.length) {
    const empty = document.createElement("p");
    empty.className = "records-empty";
    empty.textContent = state.ordersShowAll
      ? "No hay pedidos que coincidan con los filtros."
      : "No hay pedidos para esta fecha. Los atrasados aparecerán automáticamente en el día de hoy.";
    dom.ordersList.append(empty);
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("article");
    card.className = `order-card${orderIsOverdue(order) ? " is-overdue" : ""}`;
    const content = document.createElement("div");
    const top = document.createElement("div");
    top.className = "order-card__top";
    const number = document.createElement("span");
    number.className = "order-card__number";
    number.textContent = order.order_number;
    top.append(number, statusChip(order.status));
    const title = document.createElement("h3");
    title.textContent = order.client_name;
    const meta = document.createElement("p");
    meta.className = "order-card__meta";
    [order.district, `Entrega: ${formatDate(scheduledDate(order))}`, `${numberLabel(orderWeight(order))} kg`, order.registered_by_name ? `Encargado: ${order.registered_by_name}` : ""]
      .filter(Boolean)
      .forEach((value) => {
        const span = document.createElement("span");
        span.textContent = value;
        meta.append(span);
      });
    const products = document.createElement("p");
    products.className = "order-card__products";
    products.textContent = order.order_items.map((line) => `${line.product_name}: ${numberLabel(line.quantity)} ${line.unit}`).join(" · ");
    content.append(top, title, meta, products);
    if (orderIsOverdue(order)) {
      const alert = document.createElement("span");
      alert.className = "order-card__alert";
      alert.textContent = `Urgente: programado para ${formatDate(scheduledDate(order))}`;
      content.append(alert);
    }

    const actions = document.createElement("div");
    actions.className = "order-card__actions";
    const detail = document.createElement("button");
    detail.type = "button";
    detail.className = "order-action order-action--secondary";
    detail.textContent = "Ver detalle y códigos";
    detail.addEventListener("click", () => openOrderDetail(order.id));
    actions.append(detail);
    const next = nextDispatchAction(order);
    if (next) {
      const advance = document.createElement("button");
      advance.type = "button";
      advance.className = "order-action";
      advance.textContent = next.label;
      advance.addEventListener("click", () => transitionOrder(order, next, advance));
      actions.prepend(advance);
    }
    card.append(content, actions);
    dom.ordersList.append(card);
  });
}

async function fetchOrders() {
  if (!canUseDispatch()) return;
  dom.ordersList.innerHTML = '<div class="loading-line" aria-label="Cargando pedidos"></div>';
  setMessage(dom.ordersMessage);
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at, requested_date, notes, registered_by_name, registered_by_email, clients(name, phone), client_addresses(city, address_line), order_items(id, product_name, quantity, unit, unit_weight_kg, order_item_codes(id, code))")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    setMessage(dom.ordersMessage, errorLabel(error));
    dom.ordersList.replaceChildren();
    return;
  }
  state.orders = (data || []).map(normalizeOrder);
  renderOrders();
}

async function invokeAdminUsers(body) {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) {
    let serverMessage = data?.error;
    if (!serverMessage && error.context instanceof Response) {
      try {
        const payload = await error.context.clone().json();
        serverMessage = payload?.error;
      } catch (_) {
        // Supabase may return an empty or non-JSON response.
      }
    }
    throw new Error(serverMessage || error.message || "No se pudo gestionar el usuario.");
  }
  if (data?.error) throw new Error(data.error);
  return data || {};
}

function renderUsers() {
  const query = dom.usersSearch.value.trim().toLocaleLowerCase("es");
  const visible = state.users.filter((user) => {
    const searchable = [user.full_name, user.email, roleLabel(user.role)].filter(Boolean).join(" ").toLocaleLowerCase("es");
    return !query || searchable.includes(query);
  });
  dom.usersList.replaceChildren();
  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "records-empty";
    empty.textContent = query ? "No hay usuarios que coincidan con la búsqueda." : "No se encontraron usuarios.";
    dom.usersList.append(empty);
    return;
  }

  visible.forEach((user) => {
    const card = document.createElement("article");
    card.className = "user-card";
    const identity = document.createElement("div");
    identity.className = "user-card__identity";
    const name = document.createElement("strong");
    name.textContent = user.full_name || "Usuario sin nombre";
    const email = document.createElement("small");
    email.textContent = user.email || "Sin correo disponible";
    const meta = document.createElement("div");
    meta.className = "user-card__meta";
    const role = document.createElement("span");
    role.className = "user-role";
    role.textContent = roleLabel(user.role);
    const status = document.createElement("span");
    status.className = `user-status ${user.is_active ? "is-active" : "is-inactive"}`;
    status.textContent = user.is_active ? "Activo" : "Inactivo";
    meta.append(role, status);
    identity.append(name, email, meta);

    const change = document.createElement("button");
    change.type = "button";
    change.className = "user-card__action";
    change.textContent = "Cambiar contraseña";
    change.addEventListener("click", () => openPasswordDialog(user));
    card.append(identity, change);
    dom.usersList.append(card);
  });
}

async function fetchUsers() {
  if (!canManageUsers()) return;
  dom.usersList.innerHTML = '<div class="loading-line" aria-label="Cargando usuarios"></div>';
  setMessage(dom.usersMessage);
  try {
    const data = await invokeAdminUsers({ action: "list" });
    state.users = Array.isArray(data.users) ? data.users.sort((a, b) => String(a.full_name || "").localeCompare(String(b.full_name || ""), "es")) : [];
    renderUsers();
  } catch (error) {
    dom.usersList.replaceChildren();
    setMessage(dom.usersMessage, errorLabel(error));
  }
}

function openPasswordDialog(user) {
  dom.passwordForm.reset();
  dom.passwordForm.elements.userId.value = user.id;
  setMessage(dom.passwordMessage);
  dom.passwordUser.replaceChildren();
  const name = document.createElement("strong");
  name.textContent = user.full_name || "Usuario sin nombre";
  const email = document.createElement("small");
  email.textContent = user.email || "Sin correo disponible";
  dom.passwordUser.append(name, email);
  dom.passwordDialog.showModal();
  requestAnimationFrame(() => dom.passwordForm.elements.password.focus());
}

function subscribeToOrders() {
  if (!canUseDispatch() || state.ordersChannel) return;
  state.ordersChannel = supabase
    .channel(`portal-orders-${state.session.user.id}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
    .subscribe();
}

function detailBlock(label, title, lines = [], wide = false) {
  const block = document.createElement("section");
  block.className = `detail-block${wide ? " detail-block--wide" : ""}`;
  const eyebrow = document.createElement("span");
  eyebrow.textContent = label;
  const heading = document.createElement("h3");
  heading.textContent = title;
  block.append(eyebrow, heading);
  lines.filter(Boolean).forEach((value) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = value;
    block.append(paragraph);
  });
  return block;
}

async function saveCodes(order, line, input, button) {
  const codes = input.value
    .split(/[\s,;]+/)
    .map((value) => value.trim().toUpperCase())
    .filter((value) => value.length >= 2);
  if (!codes.length) return showToast("Ingresa al menos un código válido.", true);
  button.disabled = true;
  try {
    const { data, error } = await supabase.rpc("add_order_item_codes", {
      p_order_item_id: line.id,
      p_codes: codes,
    });
    if (error) throw error;
    if (data?.duplicates?.length) {
      showToast(`No se guardó ningún código. Repetidos: ${data.duplicates.join(", ")}`, true);
      button.disabled = false;
      return;
    }
    showToast(`${data?.inserted || codes.length} código${(data?.inserted || codes.length) === 1 ? "" : "s"} guardado${(data?.inserted || codes.length) === 1 ? "" : "s"}.`);
    await fetchOrders();
    openOrderDetail(order.id, true);
  } catch (error) {
    showToast(errorLabel(error), true);
    button.disabled = false;
  }
}

async function removeCode(order, code) {
  if (!window.confirm(`¿Eliminar el código ${code.code}?`)) return;
  try {
    const { error } = await supabase.rpc("remove_order_item_code", { p_code_id: code.id });
    if (error) throw error;
    showToast(`Código ${code.code} eliminado.`);
    await fetchOrders();
    openOrderDetail(order.id, true);
  } catch (error) {
    showToast(errorLabel(error), true);
  }
}

function renderOrderDetail(order) {
  dom.orderDialogTitle.textContent = `${order.order_number} · ${orderStatuses[order.status] || order.status}`;
  dom.orderDetail.replaceChildren();
  const grid = document.createElement("div");
  grid.className = "order-detail-grid";
  grid.append(
    detailBlock("Cliente y destino", order.client_name, [order.client_phone, order.district, order.address_line, `Entrega: ${formatDate(scheduledDate(order))}`]),
    detailBlock("Responsable", order.registered_by_name || "Usuario", [order.registered_by_email, `Peso total: ${numberLabel(orderWeight(order))} kg`]),
  );
  if (order.notes?.trim()) grid.append(detailBlock("Observaciones", "Notas del pedido", [order.notes.trim()], true));

  const products = detailBlock("Trazabilidad", "Productos y códigos", [], true);
  order.order_items.forEach((line) => {
    const item = document.createElement("article");
    item.className = "order-line";
    const heading = document.createElement("div");
    heading.className = "order-line__heading";
    const name = document.createElement("strong");
    name.textContent = line.product_name;
    const quantity = document.createElement("span");
    quantity.textContent = `${numberLabel(line.quantity)} ${line.unit} · ${numberLabel(Number(line.quantity) * Number(line.unit_weight_kg || 0))} kg`;
    heading.append(name, quantity);
    item.append(heading);

    const codes = document.createElement("div");
    codes.className = "codes-list";
    if (!line.order_item_codes.length) {
      const empty = document.createElement("span");
      empty.className = "codes-empty";
      empty.textContent = "Sin códigos registrados.";
      codes.append(empty);
    } else {
      line.order_item_codes.forEach((code) => {
        const chip = document.createElement("span");
        chip.className = "code-chip";
        chip.append(code.code);
        if (permission("manage_order_codes") && ["confirmed", "preparing", "ready_for_dispatch", "delivered"].includes(order.status)) {
          const remove = document.createElement("button");
          remove.type = "button";
          remove.title = `Eliminar ${code.code}`;
          remove.textContent = "×";
          remove.addEventListener("click", () => removeCode(order, code));
          chip.append(remove);
        }
        codes.append(chip);
      });
    }
    item.append(codes);

    if (permission("manage_order_codes") && ["confirmed", "preparing", "ready_for_dispatch", "delivered"].includes(order.status)) {
      const form = document.createElement("form");
      form.className = "codes-form";
      const label = document.createElement("label");
      const labelText = document.createElement("span");
      labelText.textContent = "Añadir códigos";
      const input = document.createElement("input");
      input.placeholder = "4104M, 5610M, 8199A";
      input.autocomplete = "off";
      label.append(labelText, input);
      const save = document.createElement("button");
      save.type = "submit";
      save.textContent = "Guardar códigos";
      form.append(label, save);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        saveCodes(order, line, input, save);
      });
      item.append(form);
    }
    products.append(item);
  });
  grid.append(products);
  dom.orderDetail.append(grid);
}

function openOrderDetail(orderId, alreadyOpen = false) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return showToast("El pedido ya no está disponible.", true);
  state.selectedOrderId = orderId;
  renderOrderDetail(order);
  if (!alreadyOpen && !dom.orderDialog.open) dom.orderDialog.showModal();
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
  subscribeToOrders();

  try {
    if (canUseProduction() || canUseDemolding()) await fetchProducts();
    await Promise.all([
      canUseProduction() ? loadRecords("production") : Promise.resolve(),
      canUseDemolding() ? fetchBalances().then(() => loadRecords("demolding")) : Promise.resolve(),
      canUseDispatch() ? fetchOrders() : Promise.resolve(),
      canManageUsers() ? fetchUsers() : Promise.resolve(),
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
  if (dom.orderDialog.open) dom.orderDialog.close();
  if (dom.passwordDialog.open) dom.passwordDialog.close();
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
document.querySelector("[data-refresh-orders]").addEventListener("click", () => fetchOrders());
document.querySelector("[data-refresh-users]").addEventListener("click", () => fetchUsers());
dom.ordersDate.addEventListener("change", () => {
  state.ordersShowAll = false;
  dom.ordersAll.textContent = "Ver todas las fechas";
  renderOrders();
});
dom.ordersSearch.addEventListener("input", renderOrders);
dom.ordersStatus.addEventListener("change", renderOrders);
dom.ordersAll.addEventListener("click", () => {
  state.ordersShowAll = !state.ordersShowAll;
  dom.ordersAll.textContent = state.ordersShowAll ? "Filtrar por fecha" : "Ver todas las fechas";
  renderOrders();
});
dom.usersSearch.addEventListener("input", renderUsers);
document.querySelector("[data-close-order-dialog]").addEventListener("click", () => dom.orderDialog.close());
dom.orderDialog.addEventListener("click", (event) => {
  if (event.target === dom.orderDialog) dom.orderDialog.close();
});
document.querySelector("[data-close-password-dialog]").addEventListener("click", () => dom.passwordDialog.close());
document.querySelector("[data-cancel-password]").addEventListener("click", () => dom.passwordDialog.close());
dom.passwordDialog.addEventListener("click", (event) => {
  if (event.target === dom.passwordDialog) dom.passwordDialog.close();
});
dom.passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(dom.passwordMessage);
  if (!canManageUsers()) return setMessage(dom.passwordMessage, "Tu cuenta no tiene permiso para gestionar usuarios.");
  const password = String(dom.passwordForm.elements.password.value || "");
  const confirmation = String(dom.passwordForm.elements.confirmation.value || "");
  if (password.length < 8) return setMessage(dom.passwordMessage, "La contraseña debe tener al menos 8 caracteres.");
  if (password !== confirmation) return setMessage(dom.passwordMessage, "Las contraseñas no coinciden.");

  const userId = dom.passwordForm.elements.userId.value;
  setBusy(dom.passwordSave, true, "Guardando…");
  try {
    await invokeAdminUsers({ action: "change_password", user_id: userId, password });
    const changedOwnPassword = userId === state.session.user.id;
    dom.passwordForm.reset();
    dom.passwordDialog.close();
    if (changedOwnPassword) {
      await supabase.auth.signOut({ scope: "local" });
      showLogin("Contraseña actualizada. Inicia sesión nuevamente.");
    } else {
      showToast("Contraseña actualizada y sesiones anteriores cerradas.");
    }
  } catch (error) {
    setMessage(dom.passwordMessage, errorLabel(error));
  } finally {
    setBusy(dom.passwordSave, false, "");
  }
});

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
dom.ordersDate.value = localDateValue();

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
