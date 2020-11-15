// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;

let $ = importModule('core');
console.log($)
let url_app_icon =
  'https://app.sharesies.nz/s/i/pineapple-ios-icon-2a9b888e06d04ee1e106b06dbee5ca8c.png';
let url_login = 'https://app.sharesies.nz/api/identity/login';
let url_stats = 'https://app.sharesies.nz/api/accounting/stats-v3';
let color_bg = '#ef496f';
let color_text = '#fff7af';
let color_text_sub = '#ffffff';
let interval = 60; // min



function parseArgs() {
  return args.widgetParameter ? args.widgetParameter.split('|') : ['', ''];
}

async function login(email, password) {
  try {
    let r = new Request(url_login);
    r.method = 'POST';
    r.body = JSON.stringify({
      email,
      password,
      remember: true,
    });
    r.headers = {
      'content-type': 'application/json',
    };
    let data = await r.loadJSON();
    let user_id = data.user.id;
    let preferred_name = data.user.preferred_name;
    let cookies = r.response.headers['Set-Cookie'];
    let session = cookies.match(/(session=\S+;)/)[0];
    return { session, user_id, preferred_name };
  } catch (err) {
    throw new Error('login failed,' + err.toString());
  }
}

async function get_stats(user_id, session) {
  let r = new Request(`${url_stats}?acting_as_id=${user_id}`);
  r.method = 'GET';
  r.headers = {
    cookie: session,
  };
  let data = await r.loadJSON();
  return data.stats;
}

async function createWidget(stats, name) {
  let returns = stats.total_returns_dollars;
  let returns_percentage = stats.total_returns_percentage;
  let appIcon = await $.loadImage(url_app_icon);

  let textProps = {
    minimumScaleFactor: 0.5,
    lineLimit: 1,
    '-centerAlignText': [],
  };

  let widget = $.w`
  <ListWidget  ...${{
    backgroundColor: color_bg,
    refreshAfterDate: new Date(Date.now() + 1000 * 60 * interval),
  }} >
    <Stack>
      <Image init=${appIcon} imageSize=${[24, 24]} cornerRadius=${4}/>
      <Text ...${{
        init: name,
        font: 'headline',
        textColor: color_text,
      }}/>
    </>
    <Spacer/>
    <Text  ...${{
      init: '$' + returns,
      font: ['boldSystemFont', 24],
      textColor: color_text,
      ...textProps,
    }} />
    <Text ...${{
      init: 'Estimated returns',
      font: ['systemFont', 10],
      textColor: color_text_sub,
      ...textProps,
    }} />
    <Spacer/>
    <Text  ...${{
      init: returns_percentage + '%',
      font: ['boldSystemFont', 20],
      textColor: color_text,
      ...textProps,
    }} />
    <Text ...${{
      init: 'Percent returns',
      font: ['systemFont', 10],
      textColor: color_text_sub,
      ...textProps,
    }} />
  </>
  `;

  return widget;
}

async function run() {
  let [email, pwd] = parseArgs();
  if (!email || !pwd) {
    throw new Error('no email or password');
  }
  let { session, user_id, preferred_name } = await login(email, pwd);

  let stats = await get_stats(user_id, session);

  let widget = await createWidget(stats, preferred_name);

  if (config.runsInWidget) {
    await Script.setWidget(widget);
  } else {
    await widget.presentMedium();
  }
  Script.complete();
}

async function main() {
  try {
    await run();
  } catch (err) {
    let w = new ListWidget();
    w.backgroundColor = new Color('#ef496f');
    w.addText(err.toString());
    if (config.runsInWidget) {
      Script.setWidget(w);
    } else {
      w.presentMedium();
    }
  }
}

main();
