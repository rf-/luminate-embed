# luminate-embed

`luminate-embed` is a script for embedding Luminate Online actions in any page.

## Features and Limitations

 * Embeds action alerts only

 * Supports `TextValue` and `MultiSingle` inputs, with special rendering logic
   for `state`, `subject`, and `body`

 * Supports IE 8 and up, in theory, although it's only been tested on modern
   browsers

 * Requires jQuery or Zepto to be loaded on the page, since it's built on top
   of Noah Cooper's [`luminateExtend.js`]

 * Does not support multiple API keys or org URLs on the same page, since
   [`luminateExtend.js`]'s configuration is global

## Usage

This tool is designed to be used by pasting a snippet of HTML into your page.
The action form will appear wherever you pasted the code.

Here's a minimal example, with placeholders in all caps:

``` javascript
<script type="text/javascript">
  var _leQ = _leQ || [];

  (function() {
    var id = 'luminate-embed-' + _leQ.length
    document.write('<div id="' + id + '"></div>');

    _leQ.push({
      container: document.getElementById(id),
      apiKey: 'API_KEY',
      path: {
        nonsecure: 'http://ORGANIZATION.org/site/',
        secure: 'https://secureNUMBER.convio.net/ORGANIZATION/site/'  // e.g. secure2.convio.net or secure3.convio.net
      },
      actionId: ACTION_ID,
      preview: true
    });

    if (!document.getElementById("luminate-embed-script")) {
      var script = document.createElement('script');
      script.src = "https://rawgit.com/rf-/luminate-embed/master/build/luminate-embed-0.0.3.min.js";
      script.id = "luminate-embed-script";
      document.head.appendChild(script);
    }
  })();
</script>
```

*Important: The `preview` option will prevent the action from actually
happening. You have to remove this flag when you're ready to deploy your code
to production.*

You should also host the script on your own server or CDN and replace the
`rawgit.com` URL accordingly.

Note that the Luminate Online API only works from pages that are on whitelisted
domains; see the [`luminateExtend.js` docs] for more details.

### Options

The only mandatory options are the ones in the example above, but there are
more options that you can use to customize the behavior of the embedded form:

``` javascript
_leQ.push({
  // The container to render the form into. You probably don't want to change
  // this.
  container: document.getElementById(id),

  // Your Luminate Online API key.
  apiKey: '12345678',

  // Your organization's nonsecure and secure Luminate Online URLs.
  path: {
    nonsecure: 'http://act.my-organization.org/site/',
    secure: 'https://secure2.convio.net/myorg/site/'
  },

  // An object containing extra parameters to send along with the action
  // (e.g., for analytics)
  extraParams: {
    s_src: "foo",
    s_subsrc: "bar"
  },

  // The id of the action alert that you want to embed.
  actionId: ACTION_ID,

  // Whether to use Luminate Online's preview mode when taking the action.
  // You should always use this in development to avoid sending any fake
  // messages.
  preview: true,

  // Human-readable labels for the action's `questionId`s. All fields listed in
  // the Luminate Online docs have default labels, but you can override them if
  // you want, and you have to provide labels for any custom fields the action
  // may have.
  fieldNames: {
    body: "Custom label for the body",
    customQuestion: "Label for a custom field"
  },

  // An array of `questionId`s to hide from the user; when the user takes
  // the action, the default values for these fields will be sent to the
  // server.
  hiddenFields: ["subject", "body"],

  // An array of `questionId`s to completely leave out of the form and not send
  // to the server.
  skippedFields: ["cc"],

  // An array of field names to be shown in the specified order. Any fields
  // that aren't mentioned will be shown afterwards in their natural order.
  fieldOrder: ["last_name", "first_name"],

  // The text to show on the submit button; defaults to "Take Action".
  submitText: "Send Message",

});
```

## Development

Install dependencies using [Yarn]:

```
yarn
```

Do incremental non-minified builds:

```
node_modules/.bin/rollup -wc
```

Do a full build:

```
yarn run build
```

Built files end up in `build/`.

[`luminateExtend.js`]: https://github.com/noahcooper/luminateExtend
[`luminateExtend.js` docs]: https://github.com/noahcooper/luminateExtend#libSetup
[Yarn]: https://yarnpkg.com
