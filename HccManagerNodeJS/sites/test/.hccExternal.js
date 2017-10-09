getExternals({zMin:18, zCnt:1, xMin:4282, xCnt:4, yMin:2706, yCnt:4});

function getExternals(args) {
	// 13/51.9639/8.2343
	// https://b.tile.openstreetmap.org/13/4282/2706.png
	var urlPattern = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var sList = ['a','b','c'];

	for (var z = args.zMin; z < args.zMin + args.zCnt; z++) {
		for (var y = args.yMin; y < args.yMin + args.yCnt; y++) {
			for (var x = args.xMin; x < args.xMin + args.xCnt; x++) {
				var url = urlPattern.replace("{s}", sList[0])
					.replace("{z}", z.toString())
					.replace("{y}", y.toString())
					.replace("{x}", x.toString());
				
				print("get: " + url);
				external.AddCachedExternalData(url);
				for (var i = 1; i < sList.length; i++) {
					var aliasUrl = urlPattern.replace("{s}", sList[i])
						.replace("{z}", z.toString())
						.replace("{y}", y.toString())
						.replace("{x}", x.toString());
					
					print("alias: " + url + " -> " + aliasUrl);
					external.AddCachedAlias(aliasUrl,url);
				}
			}
		}
		args.yMin *= 2;
		args.xMin *= 2;
		args.yCnt *= 2;
		args.xCnt *= 2;
	}
}

