import wretch from 'wretch';

let wr = wretch();

export function setBaseURL(url = '') {
  wr = wr.url(url.replace(/\/$/, ''), true);
}

export function setAuth(token = '') {
  wr = wr.auth(token);
}

/** @returns {Promise<ApiTypes.LoginResponseOk>} */
export function token(username, password, client_id, client_secret) {
  return wr.url('/oauth/token')
    .post({
      username,
      password,
      client_id,
      client_secret,
      grant_type: 'password'
    })
    .json();
}

export function logout(token) {
  return wr.url('/oauth/revoke')
    .post({ token })
    .json();
}

export function user() {
  return wr.url('/api/v1/user/')
    .get()
    .json();
}

/** @returns {Promise<SDWC.NodeInfo[]>} */
export function nodes() {
  return wr.url('/api/v1/nodes/')
    .get()
    .json(json => json || []);
}

/** @returns {Promise<SDWC.PlanInfo[]>} */
export function plans() {
  return wr.url('/api/v2/plans/')
    .get()
    .json(json => json || []);
}

/**
 * @param {SDWC.PlanInfo}
 * @returns {Promise<SDWC.PlanInfo>}
 */
export function createPlan(plan) {
  return wr.url('/api/v2/plans/')
    .post(plan)
    .json();
}

/**
 * @param {number} id Plan ID
 * @param {SDWC.PlanInfo} plan PlanInfo
 * @returns {Promise<SDWC.PlanInfo[]>}
 */
export function updatePlan(id, plan) {
  return wr.url(`/api/v2/plans/${id}`)
    .put(plan)
    .json();
}

export function deletePlan(id) {
  return wr.url(`/api/v2/plans/${id}`)
    .delete()
    .json();
}

export function runPlanJob(id) {
  return wr.url(`/api/v2/plans/${id}/jobs/`)
    .post()
    .text();
}

/** @returns {Promise<SDWC.PlanJob[]>} */
export function getPlanJobs(id) {
  
  // return wr.url(`/api/v2/plans/${id}/jobs/`)
  
  // 刷新暂停页面时无法给以正确地址，因此改了，需要确定服务器地址是指定的
  let mm = wr.url(`/api/v2/plans/${id}/jobs/`)
  mm._url = 'https://watuav.sbnet.xyz/gosd'+`/api/v2/plans/${id}/jobs/`
  return mm
    .get()
    .json(json => json || []);
}

export function cancelPlanJob(planId, jobId) {
  return wr.url(`/api/v2/plans/${planId}/jobs/${jobId}/cancel`)
    .post()
    .text();
}

export function downloadFile(url) {
  return wr.url(url)
    .get()
    .res();
}

export function downloadBlob(id) {
  return downloadFile(`/api/v2/blobs/${id}`);
}

export function picBlob(id) {
  return downloadFile(`/api/v1/blobs/${id}`);
}

/**
 * @param {{ [key: string]: File }} files
 * @returns {Promise<{ [key: string]: string }>}
 */
export function uploadFile(files) {
  return wr.url('/api/v2/blobs/')
    .formData(files)
    .post()
    .json();
}

/**
 * 任务列表
 */
export function indexPlan() {
  // console.log('ddddd',wr.url('/api/v2/plans/'));

  // return wr.url('/api/v2/plans/')

  // 刷新暂停页面时无法给以正确地址，因此改了，需要确定服务器地址是指定的
  let mm = wr.url('/api/v2/plans/')
  mm._url = 'https://watuav.sbnet.xyz/gosd'+'/api/v2/plans/'
  return mm
    .get()
    .json();
}
