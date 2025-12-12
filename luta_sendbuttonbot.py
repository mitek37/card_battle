import discord
from discord.ext import commands
import os
import datetime
import random

TOKEN = ""
IMAGE_FOLDER = "image"  # フォルダの親ディレクトリ

intents = discord.Intents.default()

bot = commands.Bot(command_prefix="!", intents=intents)

def return_mes(mes):
    today = datetime.date.today()
    weekday = today.weekday()

    # 月水金日：スカーレット
    hello = [
        "",
        "こちらLuta管理部顧客情報管理課のスカーレットです。\nお客様に関するお問い合わせがありましたらお申し出ください！",
        "こちらLuta管理部顧客情報管理課のスカーレットです。\nお客様に関するお問い合わせでよろしかったでしょうか？",
        "いつもご利用ありがとうございます。\nLuta管理部顧客情報管理課のスカーレットです。ご用件は何でしょうか？"
    ]
    gaitou = [
        "",
        "該当する世界に登録されているお客様情報は以下の通りです。\nご希望のお客様情報を選択してください。",
        "以下のお客様情報が登録されています。\nどのお客様情報を閲覧なさいますか？",
        "情報照会を希望するお客様のお名前を選択してください。"
    ]
    not_gaitou = [
        "",
        "おっしゃる内容と一致する顧客情報は見つかりませんでした…\n大変申し訳ございません…",
        "該当する世界に登録されているお客様情報はみつかりませんでした…",
        "該当する世界が見つかりませんでした。お手数ですが再度入力の方をお願いいたします…"
    ]
    seeyou = [
        "",
        "またのご利用をお待ちしております><",
        "ご利用ありがとうございました。",
        "以下が該当するお客様情報になります。"
        ]
    
    # 火木土：シロノア
    if weekday in [1,3,5]:
        hello = [
            "",
            "あどうも、Luta管理部財務課のシロノアです…。\nえっと…お客様情報、でしたっけ…？",
            "い、いつもありがとうございます…管理局財務課のシロノアです…。\nえっと、ご用件は…？",
            "Luta管理部財務課のシロノアです、\nえ？何で財務課がサポート電話に出てるのかって…？あはは…"
        ]
        gaitou = [
            "",
            "この世界には、これだけのお客様がいますね…\nど、どの情報を見ます？",
            "お客様情報がでてきました…！\nご希望のお客さんはどなたでしょうか…？",
            "登録されてるお客様はこれで全員ですね…\nお客様はえっと、どの情報が見たいですか？"
        ]
        not_gaitou = [
            "",
            "該当する世界にお客様はいないみたいです…す、すみません…！",
            "お、お客様…！この世界の情報はまだ登録されていないみたいです…！",
            "も、申し訳ありません…！該当するお客様がまだいないみたいです…"
        ]
        see_you = [
            "",
            "こ、こちらのお客様であってますかね…？",
            "このお客様の情報はこちら…だったはず…",
            "またのご利用…お待ちしてます…！",
            "この資料だっけ…あ、あれ違ったかなぁ…？？",
        ]

    if mes == "hello": return hello[random.randint(1,len(hello)-1)]
    if mes == "gaitou": return gaitou[random.randint(1,len(gaitou)-1)]
    if mes == "not_gaitou": return not_gaitou[random.randint(1,len(not_gaitou)-1)]
    if mes == "seeyou": return seeyou[random.randint(1,len(seeyou)-1)]

    return "メッセージエラーです。\nこのメッセージが出たら、MITEK37を叩き起こしてください。"



class ImageButton(discord.ui.Button):
    def __init__(self,message, label: str, image_path: str):
        super().__init__(label=label, style=discord.ButtonStyle.primary)
        self.image_path = image_path
        self.message = message

    async def callback(self,interaction: discord.Interaction):
        await interaction.response.send_message(return_mes("seeyou"),file=discord.File(self.image_path))

class ImageView(discord.ui.View):
    def __init__(self, image_folder,message):
        super().__init__(timeout=None)
        # フォルダ内の画像を探す
        for filename in os.listdir(image_folder):
            if filename.lower().endswith((".png", ".jpg", ".jpeg")):
                image_path = os.path.join(image_folder, filename)
                labelname = filename.replace(".png","")
                labelname = labelname.replace(".jpg","")
                labelname = labelname.replace(".jpeg","")
                button = ImageButton(message,label=labelname, image_path=image_path)
                self.add_item(button)

@bot.event
async def on_ready():
    print(f"ログイン完了: {bot.user}")

@bot.event
async def on_message(message):

    def find_folder(base_path: str, keyword: str):
        if not os.path.isdir(base_path):
            raise ValueError("カレントディレクトリエラー")

        folders = [
            name for name in os.listdir(base_path)
            if os.path.isdir(os.path.join(base_path, name))
        ]

        for name in folders:
            if keyword.lower() in name.lower(): 
                return os.path.join(base_path, name)

        return None
    
    if message.author.bot:
        return

    if bot.user in message.mentions:
        # メンション部分を削除
        content = message.content.replace(f"<@{bot.user.id}>", "").strip()
        folder_name = content
        print(folder_name)

        folder_path = os.path.join(IMAGE_FOLDER, folder_name)
        if find_folder(IMAGE_FOLDER,folder_name) != None:
            view = ImageView(find_folder(IMAGE_FOLDER,folder_name),message)
            await message.channel.send(f"{folder_name} : " + return_mes("gaitou"), view=view)
        else:
            await message.reply(return_mes("hello"))


    if message.reference and message.reference.resolved:
        original = message.reference.resolved
        if original.author == bot.user:
            # メンション部分を削除
            content = message.content.replace(f"<@{bot.user.id}>", "").strip()
            folder_name = content
            print(folder_name)

            folder_path = os.path.join(IMAGE_FOLDER, folder_name)
            if find_folder(IMAGE_FOLDER,folder_name) != None:
                view = ImageView(find_folder(IMAGE_FOLDER,folder_name),message)
                await message.channel.send(f"{folder_name} : " + return_mes("gaitou"), view=view)
            else:
                await message.channel.send(return_mes("not-gaitou"))

bot.run(TOKEN)
