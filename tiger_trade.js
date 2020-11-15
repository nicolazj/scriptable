// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;

let $ = importModule('core');
let url_endpoint = 'https://trade.itiger.com/portfolio/assets';
let url_icon =
  'https://static.itiger.com/portal5/static/images/logo.152.abf5ec9c.png';
let textProps = {
  minimumScaleFactor: 0.5,
  lineLimit: 1,
  '-centerAlignText': [],
};

async function main() {
  let auth = args.widgetParameter;
  let r = new Request(url_endpoint);
  r.method = 'GET';
  r.headers = {
    Authorization: auth,
  };
  let data = await r.loadJSON();
  let { unrealizedPnl, totalTodayPnl, netLiquidation } = data.data.sec;

  let icon = await $.loadImage(url_icon);


  let widget = $.w`
    <ListWidget >
        <Image init=${icon} imageSize=${[24, 24]} cornerRadius=${4} -centerAlignImage/>
        <Spacer/>
        <Text init=${'$' + netLiquidation.toFixed(2)} font=title1  ...${textProps} />
        <Text init="Total Assets" font=caption1 ...${textProps}/>
        <Spacer/>
        <Stack -centerAlignContent>
          <Stack -layoutVertically>
            <Text init=${'$' + unrealizedPnl.toFixed(2)} font=title2 ...${textProps}/>
            <Text init="Unrealized" font=caption2 ...${textProps}/>
          </>
          <Spacer/>
          <Stack -layoutVertically>
            <Text init=${'$' + totalTodayPnl.toFixed(2)}font=title2  ...${textProps}/>
            <Text init="Today's P&L" font=caption2 ...${textProps}/>
          </>
        </>
    </>
`;

  if (config.runsInWidget) {
    await Script.setWidget(widget);
  } else {
    await widget.presentMedium();
  }
  Script.complete();
}

main();
