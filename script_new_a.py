import os
import json
import shutil
from PIL import Image

def main():

    # 必要なインスタンス

    IMAGE_DIR = "C:/Users/alamo/Desktop/うちのこカードバトル/カード/image"

    category = {
        "all":[],

        "chara":[],
        "37":[],
        "96":[],
        "600":[],
        "4023":[],
        "5170":[],
        "8286":[],
        "10005":[],
        "c_rainbow":[],
        "attack":[],
        "guard":[],
        "support":[],
        "tricky":[],

        "event":[],
        "kougeki":[],
        "shien":[],
        "soubi":[],
        "tokushu":[],
        "e_rainbow":[],

        "new":[]
    }

    version = input("更新後のバージョン名 (ver X.X.X)：")

    # 個別jsonファイルの種類を定義

    def rgb_judge(r,g,b,pat):
        if (r > (pat["r"]-5)) and (r < (pat["r"]+5)):
            if (g > (pat["g"]-5)) and (g < (pat["g"]+5)):
                if (b > (pat["b"]-5)) and (b < (pat["b"]+5)):
                    return True
        
        return False


    def cate_judge(filename):
        color_pattern = {
            "chara":{"r":255,"g":168,"b":181}
        }
        img = Image.open(IMAGE_DIR + "/" + filename)

        judge = []

        r,g,b,a = img.getpixel((970,290))
        p1 = rgb_judge(r,g,b,color_pattern["chara"])
        r,g,b,a = img.getpixel((1100,290))
        p2 = rgb_judge(r,g,b,color_pattern["chara"])

        if p1 and p2:
            # キャラカード
            judge.append("chara")

            # カード縁の色検索

            color_pattern = {
                # 左上のrgb,右下のrgb
                "37":[{"r":148,"g":239,"b":241},{"r":148,"g":239,"b":241}],
                "96":[{"r":48,"g":170,"b":35},{"r":48,"g":170,"b":35}],
                "600":[{"r":46,"g":47,"b":233},{"r":46,"g":47,"b":233}],
                "4023":[{"r":255,"g":136,"b":51},{"r":255,"g":136,"b":51}],
                "5170":[{"r":55,"g":241,"b":161},{"r":55,"g":241,"b":161}],
                "8626":[{"r":119,"g":235,"b":106},{"r":119,"g":235,"b":106}],
                "10005":[{"r":192,"g":102,"b":255},{"r":192,"g":102,"b":255}],
                "c_rainbow":[{"r":255,"g":0,"b":62},{"r":255,"g":31,"b":0}]
            }

            for patkey in color_pattern:

                r,g,b,a = img.getpixel((60,60))
                p1 = rgb_judge(r,g,b,color_pattern[patkey][0])
                r,g,b,a = img.getpixel((1130,1050))
                p2 = rgb_judge(r,g,b,color_pattern[patkey][1])

                if p1 and p2:
                    judge.append(patkey)

            # ジョブの判別

            color_pattern = {
                # 左上のrgb,右下のrgb
                "attack":{"r":255,"g":84,"b":85},
                "guard":{"r":84,"g":199,"b":255},
                "support":{"r":80,"g":243,"b":80},
                "tricky":{"r":198,"g":84,"b":255},
            }

            for patkey in color_pattern:

                r,g,b,a = img.getpixel((70,325))
                p1 = rgb_judge(r,g,b,color_pattern[patkey])
                r,g,b,a = img.getpixel((240,500))
                p2 = rgb_judge(r,g,b,color_pattern[patkey])

                if p1 or p2:
                    judge.append(patkey)

        else:
            # イベントカード
            judge.append("event")

            color_pattern = {
                # 左上のrgb,右下のrgb
                "kougeki":[{"r":255,"g":105,"b":106},{"r":255,"g":105,"b":106}],
                "choukougeki":[{"r":254,"g":50,"b":50},{"r":101,"g":0,"b":0}],
                "shien":[{"r":255,"g":238,"b":101},{"r":255,"g":238,"b":101}],
                "choushien":[{"r":255,"g":229,"b":20},{"r":164,"g":146,"b":0}],
                "koushi":[{"r":255,"g":104,"b":105},{"r":255,"g":236,"b":100}],
                "soubi":[{"r":151,"g":255,"b":100},{"r":100,"g":108,"b":255}],
                "tokushu":[{"r":255,"g":68,"b":60},{"r":74,"g":60,"b":255}],
                "e_rainbow":[{"r":255,"g":0,"b":62},{"r":255,"g":31,"b":0}]
            }

            for patkey in color_pattern:

                r,g,b,a = img.getpixel((60,60))
                p1 = rgb_judge(r,g,b,color_pattern[patkey][0])
                r,g,b,a = img.getpixel((1130,1050))
                p2 = rgb_judge(r,g,b,color_pattern[patkey][1])

                if p1 and p2:
                    if "kougeki" in patkey:
                        judge.append("kougeki")
                    elif "shien" in patkey:
                        judge.append("shien")
                    elif patkey == "koushi":
                        judge.append("kougeki")
                        judge.append("shien")
                    else:
                        judge.append(patkey)

        return judge

    # image_refreshをimageに統合

    SRC_DIRS = ["C:/Users/alamo/Desktop/うちのこカードバトル/カード/image_refresh"]
    DEST_DIR = "C:/Users/alamo/Desktop/うちのこカードバトル/カード/image"

    # image ディレクトリがなければ作成
    os.makedirs(DEST_DIR, exist_ok=True)

    for src in SRC_DIRS:
        if not os.path.isdir(src):
            print(f"{src} が存在しません。スキップします。")
            continue

        for filename in os.listdir(src): # ディレクトリから1枚ずつ画像ファイルの名前を取り出す
            # 拡張子が .png のものだけ対象（大文字小文字両対応）
            if not filename.lower().endswith(".png"):
                continue

            src_path = os.path.join(src, filename)
            dest_path = os.path.join(DEST_DIR, filename)

            category["new"].append(filename) # カテゴリーに画像ファイル名を追加

            if os.path.isfile(src_path):
                shutil.copy2(src_path, dest_path)

    print("refresh内のpngファイルのコピーが完了しました。")


    # charaとeventの分類

    for filename in os.listdir(IMAGE_DIR): # ディレクトリから1枚ずつ画像ファイルの名前を取り出す
        # 拡張子が .png のものだけ対象（大文字小文字両対応）
        if not filename.lower().endswith(".png"):
            continue

        judge = cate_judge(filename)

        for j in judge:
            category[j].append(filename)

        category["all"].append(filename)

        if "rlk" in filename:
            category["tokushu"].append(filename)


    # jsonファイルの生成

    for cate in category:
        if category[cate] == []:
            continue

        # JSON フォーマット
        data = {
            "images": category[cate]
        }

        OUTPUT_JSON = "C:/Users/alamo/Desktop/うちのこカードバトル/カード/image/index_" + cate + ".json"

        # JSONを書き込む
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(OUTPUT_JSON + " を生成しました！")
        print(f"画像数: {len(category[cate])}")
        print(f"出力ファイル: {OUTPUT_JSON}")


    # 400x600サイズの画像の生成


    # 元画像ディレクトリと保存先ディレクトリ
    INPUT_DIR = "C:/Users/alamo/Desktop/うちのこカードバトル/カード/image"
    OUTPUT_DIR = "C:/Users/alamo/Desktop/うちのこカードバトル/カード/image400"

    # 保存先ディレクトリがなければ作成
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 対応する画像拡張子
    IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp", ".bmp")

    for filename in os.listdir(INPUT_DIR):
        if not filename.lower().endswith(IMAGE_EXTENSIONS):
            continue

        input_path = os.path.join(INPUT_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, filename)

        with Image.open(input_path) as img:
            # サイズ確認（1200×1800のみ処理したい場合）
            if img.size != (1200, 1800):
                print(f"スキップ（サイズ違い）: {filename}")
                continue

            # リサイズ
            resized_img = img.resize((400, 600), Image.LANCZOS)

            # 保存
            resized_img.save(output_path)

            print(f"変換完了: {filename}")

    # jsonファイルの生成

    for cate in category:
        if category[cate] == []:
            continue

        # JSON フォーマット
        data = {
            "version": version
        }

        OUTPUT_JSON = "C:/Users/alamo/Desktop/うちのこカードバトル/カード/image400/version.json"

        # JSONを書き込む
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(OUTPUT_JSON + " を生成しました！")
    


# 実行
if __name__ == "__main__":
    main()


