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
        "4023":[],
        "10005":[],

        "event":[],

        "new":[]
    }

    version = input("更新後のバージョン名 (ver X.X.X)：")

    # 個別jsonファイルの種類を定義

    def rgb_judge(r,g,b,pat):
        if (r > (pat["r"]-3)) and (r < (pat["r"]+3)):
            if (g > (pat["g"]-3)) and (g < (pat["g"]+3)):
                if (b > (pat["b"]-3)) and (b < (pat["b"]+3)):
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

            color_pattern = {
                # 左上のrgb,右下のrgb
                "37":[{"r":148,"g":239,"b":241},{"r":148,"g":239,"b":241}],
                "4023":[{"r":255,"g":136,"b":51},{"r":255,"g":136,"b":51}],
            }

            for patkey in color_pattern:

                r,g,b,a = img.getpixel((60,60))
                p1 = rgb_judge(r,g,b,color_pattern[patkey][0])
                r,g,b,a = img.getpixel((1130,1050))
                p2 = rgb_judge(r,g,b,color_pattern[patkey][1])

                if p1 and p2:
                    judge.append(patkey)
        else:
            # イベントカード
            judge.append("event")

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

