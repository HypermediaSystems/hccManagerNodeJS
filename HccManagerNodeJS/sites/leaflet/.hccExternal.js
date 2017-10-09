
// 13/51.9639/8.2343
// https://b.tile.openstreetmap.org/13/4282/2706.png

function getOne(urlPattern, sList) {
    var this_zStart = zStart;
    var this_zCnt = zCnt;
    var this_xStart = xStart;
    var this_xCnt = xCnt;
    var this_yStart = yStart;
    var this_yCnt = yCnt;

    for (var z = this_zStart; z < this_zStart + this_zCnt; z++) {
        for (var y = this_yStart; y < this_yStart + this_yCnt; y++) {
            for (var x = this_xStart; x < this_xStart + this_xCnt; x++) {
                var url = urlPattern.replace("{s}", sList[0])
                    .replace("{z}", z.toString())
                    .replace("{y}", y.toString())
                    .replace("{x}", x.toString());
                external.AddCachedExternalData(url);
                for (var i = 1; i < sList.length; i++) {
                    var aliasUrl = urlPattern.replace("{s}", sList[i])
                        .replace("{z}", z.toString())
                        .replace("{y}", y.toString())
                        .replace("{x}", x.toString());
                    external.AddCachedAlias(aliasUrl, url);
                }
            }
        }
        this_yStart *= 2;
        this_xStart *= 2;
        this_yCnt *= 2;
        this_xCnt *= 2;
    }
}


var zStart = 13;
var zCnt = 3;
var xStart = 4281;
var xCnt = 4;
var yStart = 2705;
var yCnt = 4;

getOne("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", "abc");


