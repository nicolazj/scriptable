// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;

let $ = importModule('core');
let url_endpoint =
  'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions';
let url_icon =
  'https://static.itiger.com/portal5/static/images/logo.152.abf5ec9c.png';

let textProps = {
  minimumScaleFactor: 0.5,
  lineLimit: 1,
  '-centerAlignText': [],
};

async function main() {
  let r = new Request(url_endpoint);
  let data = await r.loadJSON();

  let games = data.data.Catalog.searchStore.elements;
  let images = await Promise.all(
    games.map((game) => $.loadImage(game.keyImages[1].url))
  );

  console.log(games.map((g) => g.title));

  let node = $.html`
    <ListWidget padding=${[4,10,4,10]} backgroundColor=${'#121212'} >
      <Text init="Epic free games" ...${textProps}/>
      <Spacer/>
      <Stack -centerAlignContent>
        ${games.map(
          (game, i) => $.html`
              <Stack -layoutVertically -centerAlignContent  > 
                <Stack>
                  <Spacer/>
                  <Image init=${images[i]} cornerRadius=${5} -centerAlignImage/>
                  <Spacer/>
                </>
                <Stack>
                  <Spacer/>
                  <Text init=${
                    Date.parse(game.effectiveDate) >Date.now()? 'Coming soon':'Free now'
                  } ...${textProps} font=${['systemFont',8]}  />
                  <Spacer/>
                </>
                <Stack>
                  <Spacer/>
                  <Text init=${game.title} ...${textProps} font=${['systemFont',10]}  />
                  <Spacer/>
                </>
              </>
            `
        )}
      </>
      <Stack>
        <Spacer/>
        <Text init="Last updated at "  font=${['systemFont',8]}  />
        <Date init=${new Date()} font=${['systemFont',8]} -applyTimeStyle  />   
        <Spacer/>
      </>
    </>
`;

  let widget = $.c(node);
  if (config.runsInWidget) {
    await Script.setWidget(widget);
  } else {
    await widget.presentMedium();
  }
  Script.complete();
}

main();
