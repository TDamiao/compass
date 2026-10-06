const sidebar = document.querySelector('.cc-sidebar');
const toggle = sidebar?.querySelector('.cc-sidebar__toggle');
toggle?.addEventListener('click', () => {
  const collapsed = sidebar.dataset.collapsed !== 'true';
  sidebar.dataset.collapsed = String(collapsed);
  toggle.setAttribute('aria-expanded', String(!collapsed));
  toggle.textContent = collapsed ? 'Expand navigation' : 'Collapse navigation';
});
