import compact from "underscore/compact"
import contains from "underscore/contains"
import forEach from "underscore/forEach"
import isObject from "underscore/isObject"
import luminate from "luminateExtend"
import map from "underscore/map"
import template from "underscore/template"

import { log } from "./util"

const prefix = "luminate-embed"
const supportedTypes = ["TextValue", "MultiSingle"]

const render = template(`
  <div class="${prefix}">
    <form class="${prefix}-form">
      <div class="${prefix}-error" style="display: none;">
      </div>

      <div class="${prefix}-thanks-message-wrapper" style="display:none;">
        <div class="${prefix}-thanks-message">
          Thank you!
        </div>
      </div>

      <div class="${prefix}-wrapper">
        <div class="${prefix}-fields-block">
          <div class="${prefix}-required-fields-label">Required fields</div>

          <% forEach(fields, function(field) { %>
            <% if (field.hidden) { %>
              <%= renderHiddenField({ field: field }) %>
            <% } else if (field.name === "state" ||
                          field.type === "MultiSingle") { %>
              <%=
                renderSelectField({
                  field: field,
                  forEach: forEach,
                  stateOptions: stateOptions
                })
              %>
            <% } else { %>
              <%= renderTextField({ field: field }) %>
            <% } %>
          <% }) %>
        </div>

        <% if ((bodyField && !bodyField.hidden) ||
               (subjectField && !subjectField.hidden)) { %>
          <%=
            renderBody({
              alert: alert,
              bodyField: bodyField,
              subjectField: subjectField,
              renderTextField: renderTextField
            })
          %>
        <% } %>
      </div>

      <% if (subjectField && subjectField.hidden) { %>
        <%= renderHiddenField({ field: subjectField }) %>
      <% } %>

      <% if (bodyField && bodyField.hidden) { %>
        <%= renderHiddenField({ field: bodyField }) %>
      <% } %>

      <div class="${prefix}-footer">
        <button type="submit" class="${prefix}-submit">
          <%= submitText %>
        </button>
        <div class="${prefix}-spinner">
        </div>
      </div>
    </form>
  </div>
`)

const renderHiddenField = template(`
  <input type="hidden" name="<%= field.name %>" value="<%= field.value %>">
  </input>
`)

const renderTextField = template(`
  <div class="${prefix}-input-block ${prefix}-input-block--text">
    <label
      class="
        ${prefix}-label
        <%= field.required ? "${prefix}-label--required" : "" %>
      "
    >
      <span class="${prefix}-label-text">
        <%= field.label %>:
      </span>
      <input
        class="${prefix}-text-input"
        type="text"
        name="<%= field.name %>"
        value="<%= field.value %>"
        <%= field.required ? "required" : "" %>
      >
      </input>
    </label>
  </div>
`)

const renderBody = template(`
  <div class="${prefix}-body-block">
    <% if (subjectField && !subjectField.hidden) { %>
      <%= renderTextField({ field: subjectField }) %>
    <% } else { %>
      <div class="${prefix}-message-subject">
        Subject: <%= alert.messageSubject %>
      </div>
    <% } %>

    <div class="${prefix}-message-greeting">
      <%= alert.messageGreeting %>
      <span class="${prefix}-placeholder">[Decision Maker],</span>
    </div>

    <% if (bodyField && !bodyField.hidden) { %>
      <div class="${prefix}-input-block ${prefix}-input-block--body">
        <label
          class="
            ${prefix}-label
            <%= bodyField.required ? "${prefix}-label--required" : "" %>
          "
        >
          <span class="${prefix}-label-text">
            <%= bodyField.label %>:
          </span>
          <textarea
            class="${prefix}-textarea"
            type="textarea"
            name="<%= bodyField.name %>"
            <%= bodyField.required ? "required" : "" %>
          ><%= bodyField.value %></textarea>
        </label>
      </div>
    <% } else { %>
      <div class="${prefix}-message-body"><%= alert.messageBody %></div>
    <% } %>

    <div class="${prefix}-message-signature">
      <%= alert.messageSignature %><br>
      <span class="${prefix}-placeholder">[Your Name]</span>
    </div>
  </div>
`)

const renderSelectField = template(`
  <div class="${prefix}-input-block ${prefix}-input-block--select">
    <label
      class="
        ${prefix}-label
        <%= field.required ? "${prefix}-label--required" : "" %>
      "
    >
      <span class="${prefix}-label-text">
        <%= field.label %>:
      </span>
      <select class="${prefix}-select-input" name="<%= field.name %>">
        <% if (field.name === "state") { %>
          <%= stateOptions %>
        <% } else { %>
          <option value=""></option>
          <% forEach(field.choices, function(choice) { %>
            <option value="<%= choice.content %>"><%= choice.name %></option>
          <% }) %>
        <% } %>
      </select>
    </label>
  </div>
`)

// Copy/pasted from convio.net since the API response doesn't enumerate the
// states anywhere.
const stateOptions = `
  <option value="">Choose a State</option>
  <optgroup label="United States">
    <option value="AK">AK</option>
    <option value="AL">AL</option>
    <option value="AR">AR</option>
    <option value="AZ">AZ</option>
    <option value="CA">CA</option>
    <option value="CO">CO</option>
    <option value="CT">CT</option>
    <option value="DC">DC</option>
    <option value="DE">DE</option>
    <option value="FL">FL</option>
    <option value="GA">GA</option>
    <option value="HI">HI</option>
    <option value="IA">IA</option>
    <option value="ID">ID</option>
    <option value="IL">IL</option>
    <option value="IN">IN</option>
    <option value="KS">KS</option>
    <option value="KY">KY</option>
    <option value="LA">LA</option>
    <option value="MA">MA</option>
    <option value="MD">MD</option>
    <option value="ME">ME</option>
    <option value="MI">MI</option>
    <option value="MN">MN</option>
    <option value="MO">MO</option>
    <option value="MS">MS</option>
    <option value="MT">MT</option>
    <option value="NC">NC</option>
    <option value="ND">ND</option>
    <option value="NE">NE</option>
    <option value="NH">NH</option>
    <option value="NJ">NJ</option>
    <option value="NM">NM</option>
    <option value="NV">NV</option>
    <option value="NY">NY</option>
    <option value="OH">OH</option>
    <option value="OK">OK</option>
    <option value="OR">OR</option>
    <option value="PA">PA</option>
    <option value="RI">RI</option>
    <option value="SC">SC</option>
    <option value="SD">SD</option>
    <option value="TN">TN</option>
    <option value="TX">TX</option>
    <option value="UT">UT</option>
    <option value="VA">VA</option>
    <option value="VT">VT</option>
    <option value="WA">WA</option>
    <option value="WI">WI</option>
    <option value="WV">WV</option>
    <option value="WY">WY</option>
  </optgroup>
  <optgroup label="US Territories">
    <option value="AS">AS</option>
    <option value="FM">FM</option>
    <option value="GU">GU</option>
    <option value="MH">MH</option>
    <option value="MP">MP</option>
    <option value="PR">PR</option>
    <option value="PW">PW</option>
    <option value="VI">VI</option>
  </optgroup>
  <optgroup label="Canada">
    <option value="AB">AB</option>
    <option value="BC">BC</option>
    <option value="MB">MB</option>
    <option value="NB">NB</option>
    <option value="NL">NL</option>
    <option value="NS">NS</option>
    <option value="NT">NT</option>
    <option value="NU">NU</option>
    <option value="ON">ON</option>
    <option value="PE">PE</option>
    <option value="QC">QC</option>
    <option value="SK">SK</option>
    <option value="YT">YT</option>
  </optgroup>
  <optgroup label="Other Countries">
    <option value="None">None</option>
  </optgroup>
`

export function renderForm(action, options) {
  const { alert, _recipients, questions: rawQuestions } = action
  const { fieldNames, hiddenFields, submitText } = options
  const questions = luminate.utils.ensureArray(rawQuestions.question)

  // We track these fields separately since they have to be rendered in their
  // own block.
  let subjectField, bodyField

  const fields = compact(map(questions, question => {
    const choices = question.questionChoices &&
      luminate.utils.ensureArray(question.questionChoices.choice)

    let hidden = contains(hiddenFields, question.questionId)

    if (!fieldNames[question.questionId] && !hidden) {
      log(
        `Field "${question.questionId}" couldn't be shown because it ` +
        `doesn't have a label. Configure it with the "fieldNames" option.`
      )
      hidden = true
    }

    if (!contains(supportedTypes, question.questionType) && !hidden) {
      log(
        `Field "${question.questionId}" couldn't be shown because it is ` +
        `of unsupported type "${question.questionType}".`
      )
      hidden = true
    }

    const field = {
      label: fieldNames[question.questionId],
      name: question.questionId,
      // Empty values are represented as {} in the API, so we have to guard
      // against putting "[Object object]" in a form field.
      value: isObject(question.value) ? "" : question.value,
      required: (question.required === "true"),
      type: question.questionType,
      choices,
      hidden
    }

    if (field.name === "body") {
      bodyField = field
    } else if (field.name === "subject") {
      subjectField = field
    } else {
      return field
    }
  }))

  return render({
    alert,
    bodyField,
    fields,
    forEach,
    renderBody,
    renderHiddenField,
    renderSelectField,
    renderTextField,
    stateOptions,
    subjectField,
    submitText,
  })
}
