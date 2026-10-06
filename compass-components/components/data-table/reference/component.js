const table = document.querySelector('#projects-table');
const body = table?.tBodies[0];
const query = document.querySelector('#project-query');
const count = document.querySelector('#project-count');
const empty = document.querySelector('.cc-table-empty');
const rows = body ? [...body.rows] : [];

function filterRows() {
  const term = query.value.trim().toLocaleLowerCase();
  let visible = 0;
  for (const row of rows) {
    const match = row.textContent.toLocaleLowerCase().includes(term);
    row.hidden = !match;
    if (match) visible += 1;
  }
  count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
  empty.hidden = visible > 0;
}
query?.addEventListener('input', filterRows);

for (const button of table?.querySelectorAll('[data-sort]') ?? []) {
  button.addEventListener('click', () => {
    const key = button.dataset.sort;
    const header = button.closest('th');
    const column = [...header.parentElement.children].indexOf(header);
    const direction = button.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    for (const other of table.querySelectorAll('[data-sort]')) other.closest('th').setAttribute('aria-sort', 'none');
    header.setAttribute('aria-sort', direction);
    rows.sort((a, b) => {
      const aCell = a.cells[column];
      const bCell = b.cells[column];
      const aValue = aCell.dataset.value ?? aCell.textContent.trim();
      const bValue = bCell.dataset.value ?? bCell.textContent.trim();
      return aValue.localeCompare(bValue, undefined, { numeric: true }) * (direction === 'ascending' ? 1 : -1);
    });
    for (const row of rows) body.append(row);
  });
}
