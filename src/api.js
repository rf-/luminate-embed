import Promise from "es6-promise"
import luminate from "luminateExtend"

function getActionRaw(data) {
  return new Promise((resolve, reject) => {
    luminateExtend.api.request({
      api: "advocacy",
      data,
      callback(response) {
        if (response && response.getAdvocacyAlertResponse) {
          resolve(response.getAdvocacyAlertResponse)
        } else {
          reject(response.errorResponse)
        }
      }
    })
  })
}

export function getAction(id) {
  return getActionRaw(
    `method=getAdvocacyAlert&alert_type=action&alert_id=${id}`
  )
}

function takeActionRaw(data) {
  return new Promise((resolve, reject) => {
    luminateExtend.api.request({
      api: "advocacy",
      data,
      callback(response) {
        if (response && response.takeActionResponse) {
          resolve(response.takeActionResponse)
        } else {
          reject(response.errorResponse)
        }
      }
    })
  })
}

export function takeAction(id, formData, preview) {
  return takeActionRaw(
    `method=takeAction&preview=${!!preview}&alert_type=action&alert_id=${id}&${formData}`
  ).catch(error => {
    if (error && error.message) {
      // Hackily normalize field names like "last_name"
      throw error.message.replace(/_/g, " ")
    } else {
      throw "Sorry, there was a problem submitting your signature. Please check your information and try again."
    }
  })
}
