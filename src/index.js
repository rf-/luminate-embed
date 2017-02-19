import luminate from "luminateExtend"
import Spinner from "spin.js"

// WARNING: Reversing the order of these two imports breaks underscore/rollup
// for some reason.
import extend from "underscore/extend"
import forEach from "underscore/forEach"

import stylesheet from "./index.css"
import { getAction, takeAction } from "./api"
import { log } from "./util"
import { renderForm } from "./form"

/**
 * Names for all of the fields listed in Luminate's docs. If an action has a
 * field that isn't listed here, the caller will need to provide its name as
 * part of the `fieldNames` option.
 */
const defaultFieldNames = {
  body: "Personalize your message",
  cc: "Send me a copy of the message",
  city: "City",
  country: "Country",
  email: "Your email",
  first_name: "First name",
  last_name: "Last name",
  phone: "Phone number",
  subject: "Subject",
  state: "State / province",
  street1: "Address 1",
  street2: "Address 2",
  title: "Title",
  zip: "Zip / postal code",
}

const spinnerOptions = {
  lines: 9,
  length: 6,
  width: 11,
  radius: 17,
  scale: 0.25,
  corners: 1,
  color: "#000",
  opacity: 0.15
}

if (!window._leQ) {
  log("Not set up correctly -- see docs for the correct <script>")
} else {
  // Go through each item in the queue and run it, then replace the queue with
  // an object that responds to `length` and `push` so that future evaluations
  // of the setup code keep working.
  forEach(window._leQ, options => {
    setUpAction(options)
  })

  window._leQ = {
    length: window._leQ.length,
    push(options) {
      this.length++
      setUpAction(options)
    }
  }
}

let initialized = false

function setUpAction(options) {
  const {
    // The organization's API key
    apiKey,

    // An object containing `nonsecure` and `secure` URLs for the organization
    path,

    // The id of the action to generate a form for
    actionId,

    // A mapping from `questionId` to human-readable labels; fields listed in
    // the docs have default labels already
    fieldNames,

    // An array of `questionId`s to hide from the user; when the user takes
    // action, the default values for these fields will be sent
    hiddenFields,

    // The text to show on the submit button; defaults to "Take Action"
    submitText,

    // The DOM node to render the form into
    container,

    // Should we make destructive requests in preview mode (for testing)?
    preview,
  } = options

  if (!apiKey || !path) {
    log("Failing because `apiKey` and `path` options are required (see luminateExtend docs)")
    return
  }

  if (!actionId || !container) {
    log("Failing because `actionId` and `container` options are required")
    return
  }

  if (!initialized) {
    initialized = true

    luminate.init({ apiKey, path })

    const style = $("<style>")
    style.text(stylesheet)
    style.appendTo(document.head)
  }

  getAction(actionId)
    .then(action => {
      const $container = $(container)
      const spinner = new Spinner(spinnerOptions)

      $container.html(renderForm(action, {
        fieldNames: extend({}, defaultFieldNames, fieldNames),
        hiddenFields,
        submitText: submitText || "Take Action",
      }))

      $container.on("submit", "form", e => {
        e.preventDefault()
        e.stopPropagation()

        console.log($container.find(".luminate-embed-spinner"))
        spinner.spin($container.find(".luminate-embed-spinner").get(0))

        const data = $(e.target).serialize()

        takeAction(actionId, data, preview)
          .then(() => {
            spinner.stop()

            // TODO: Better post-submit experience
            const $form = $container.find(".luminate-embed-form")
            $form.width($form.width())
            $form.height($form.height())
            $container.find(".luminate-embed-form").children().hide()
            $form.find(".luminate-embed-thanks-message-wrapper").show()
            $container.fadeOut(1500)
          })
          .catch(message => {
            spinner.stop()
            $container.find(".luminate-embed-error")
              .text(message)
              .show()
          })
      })
    })
    .catch(reason => {
      log(`Failed to load action ${actionId}:`)
      console && console.log(reason)
    })
}
