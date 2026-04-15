/**
 * Company Position Period block
 * Expected authored structure:
 *  - First row: company name
 *  - Second row: position
 *  - Third row: period
 * This decorator renders them in a single line with dedicated classes.
 * The period element receives an `id` slug derived from its text (lowercase, hyphenated) so
 * URLs can target it as a fragment (e.g. `#2020-2024`).
 *
 * EDS sample block (Markdown table in document / `.md`):
 *
 * | company-position-period |
 * | --- |
 * | [Acme Corp](https://example.com) |
 * | Senior Software Engineer |
 * | 2020 – 2024 |
 *
 * @param {Element} block The block element
 */
function decorateExternalLink(link) {
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('aria-label', `${link.textContent.trim()} (opens in new tab)`);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'company-position-period-inner';

  const [companyRow, positionRow, periodRow] = rows;

  if (companyRow) {
    const company = document.createElement('div');
    company.className = 'company-position-period-company';
    while (companyRow.firstChild) {
      company.append(companyRow.firstChild);
    }
    const companyLink = company.querySelector('a[href]');
    if (companyLink) decorateExternalLink(companyLink);
    wrapper.append(company);
  }

  if (positionRow) {
    const position = document.createElement('div');
    position.className = 'company-position-period-position';
    while (positionRow.firstChild) {
      position.append(positionRow.firstChild);
    }
    wrapper.append(position);
  }

  if (periodRow) {
    const period = document.createElement('div');
    period.className = 'company-position-period-period';
    while (periodRow.firstChild) {
      period.append(periodRow.firstChild);
    }
    const periodText = period.textContent?.trim();
    if (periodText) {
      const periodId = periodText
        .toLowerCase()
        .replace(/[\u2013\u2014]/g, '-') // en/em dash
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (periodId) period.id = periodId;
    }
    wrapper.append(period);
  }

  block.textContent = '';
  block.append(wrapper);
}
