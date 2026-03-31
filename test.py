import json

# ファイル読み込み
with open("image/index_all.json", "r", encoding="utf-8") as f:
    index_data = json.load(f)

with open("json/card_search.json", "r", encoding="utf-8") as f:
    card_data = json.load(f)

# データ取得
images = index_data.get("images", [])
cards = card_data.get("card", {})

# 存在しないファイルを抽出
missing = [img for img in images if img not in cards]

# 結果表示
print("存在しないカード一覧:")
for m in missing:
    print(m)

print(f"\n合計: {len(missing)}件")