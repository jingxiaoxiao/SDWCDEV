import wretch from 'wretch';

let wr = wretch();

// let BaseURL = 'https://cloud.sbnet.xyz/gosd';
// let wr = wretch(BaseURL);

export function setBaseURL(url = '') {
  wr = wr.url(url.replace(/\/$/, ''), true);
}

let confProm;
/** @returns {Promise<SDWC.Config>} */
export function config() {
  if (confProm) return confProm;
  return confProm = wr.url('/config.json')
    .get()
    .json();
}

export function indexPlan() {
  return wr.url('/api/v2/plans/')
    .get()
    .json();
}