import discord
from discord.ext import commands
import os
import datetime

TOKEN = ""
IMAGE_FOLDER = "image"  # フォルダの親ディレクトリ

intents = discord.Intents.default()

bot = commands.Bot(command_prefix="!", intents=intents)

def return_mes():
    today = datetime.date.today()
    weekday = today.weekday()

    if weekday in [0,2,4,6]:
        hello = [
            ""
            "こちらLuta事務局顧客情報管理課のスカーレットです。\nお客様に関するお問い合わせがありましたらお申し出ください！",
            "こちらLuta事務局顧客情報管理課のスカーレットです。\nお客様に関するお問い合わせでよろしかったでしょうか？",
            "いつもご利用ありがとうございます。\nLuta事務局顧客情報管理課のスカーレットです。ご用件は何でしょうか？",
            "該当する世界に登録されているお客様情報は以下の通りです。\nご希望のお客様情報を選択してください。"
        ]


class ImageButton(discord.ui.Button):
    def __init__(self,message, label: str, image_path: str):
        super().__init__(label=label, style=discord.ButtonStyle.primary)
        self.image_path = image_path
        self.message = message

    async def callback(self,interaction: discord.Interaction):
        await interaction.response.send_message("またのご利用をお待ちしております><",file=discord.File(self.image_path))

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

    action = 0

    if bot.user in message.mentions:
        action = 1

    if message.reference and message.reference.resolved:
        original = message.reference.resolved
        if original.author == bot.user:
            action = 1

    if action == 1:
        # メンション部分を削除
        content = message.content.replace(f"<@{bot.user.id}>", "").strip()

        if not content:
            await message.reply("こちらLuta事務局顧客情報管理課のスカーレットです。\nお客様に関するお問い合わせがありましたらお申し出ください！")
            return
        
        content = message.content.replace(f"<@{bot.user.id}>", "").strip()
        folder_name = content
        print(folder_name)

        folder_path = os.path.join(IMAGE_FOLDER, folder_name)
        if find_folder(IMAGE_FOLDER,folder_name) != None:
            view = ImageView(find_folder(IMAGE_FOLDER,folder_name),message)
            await message.channel.send(f"{folder_name} : 該当する世界に登録されているお客様情報は以下の通りです。\nご希望のお客様情報を選択してください。", view=view)
        else:
            await message.channel.send("おっしゃる内容と一致する顧客情報は見つかりませんでした…\n大変申し訳ございません…")

bot.run(TOKEN)