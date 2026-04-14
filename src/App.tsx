import { Book, GraduationCap, Languages, ChevronLeft, ChevronRight, Eye, EyeOff, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface KanjiEntry {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  vocab: { k: string; r: string; f: string }[];
  phrases: { k: string; r: string; f: string }[];
}

// --- Data ---
// Combined data from both files provided by the user
const KANJI_DATA: KanjiEntry[] = [
  // Group 1: 近・間・右・左・外
  {
    kanji: "近", onyomi: "キン", kunyomi: "ちか（い）",
    vocab: [{ k: "近く", r: "ちかく", f: "Proche" }],
    phrases: [{ k: "家の近くにデパートがあります。", r: "いえのちかくにデパートがあります。", f: "Il y a un grand magasin près de la maison." }]
  },
  {
    kanji: "間", onyomi: "カン", kunyomi: "あいだ",
    vocab: [{ k: "間", r: "あいだ", f: "Intervalle" }, { k: "時間", r: "じかん", f: "Temps" }],
    phrases: [{ k: "AとBの間にあります。", r: "AとBのあいだにあります。", f: "C'est entre A et B." }]
  },
  {
    kanji: "右", onyomi: "ウ / ユウ", kunyomi: "みぎ",
    vocab: [{ k: "右側", r: "みぎがわ", f: "Côté droit" }],
    phrases: [{ k: "右にまがってください。", r: "みぎにまがってください。", f: "Veuillez tourner à droite." }]
  },
  {
    kanji: "左", onyomi: "サ", kunyomi: "ひだり",
    vocab: [{ k: "左側", r: "ひだりがわ", f: "Côté gauche" }],
    phrases: [{ k: "左手に時計をしています。", r: "ひだりてにとけいをしています。", f: "Je porte une montre à la main gauche." }]
  },
  {
    kanji: "外", onyomi: "ガイ", kunyomi: "そと",
    vocab: [{ k: "外出中", r: "がいしゅつちゅう", f: "En sortie" }, { k: "外国", r: "がいこく", f: "Pays étranger" }],
    phrases: [{ k: "先生は外出中ですよ。", r: "せんせいはがいしゅつちゅうですよ。", f: "Le professeur est en sortie (absent)." }]
  },
  // Group 2: 男・女・犬・書・聞
  {
    kanji: "男", onyomi: "ダン", kunyomi: "おとこ",
    vocab: [{ k: "男の人", r: "おとこのひと", f: "Homme" }],
    phrases: [{ k: "クラスに男せいは何人いますか。", r: "クラスにだんせいはなんにんいますか。", f: "Combien d'hommes y a-t-il dans la classe ?" }]
  },
  {
    kanji: "女", onyomi: "ジョ", kunyomi: "おんな",
    vocab: [{ k: "女子", r: "じょし", f: "Fille/Femme" }],
    phrases: [{ k: "女子トイレはあちらです。", r: "じょしトイレはあちらです。", f: "Les toilettes pour femmes sont là-bas." }]
  },
  {
    kanji: "犬", onyomi: "ケン", kunyomi: "いぬ",
    vocab: [{ k: "子犬", r: "こいぬ", f: "Chiot" }],
    phrases: [{ k: "毎朝、犬のさんぽをします。", r: "まいあさ、いぬのさんぽをします。", f: "Je promène le chien tous les matins." }]
  },
  {
    kanji: "書", onyomi: "ショ", kunyomi: "か（きます）",
    vocab: [{ k: "辞書", r: "じしょ", f: "Dictionnaire" }],
    phrases: [{ k: "ここに名前を書いてください。", r: "ここになまえをかいてください。", f: "Veuillez écrire votre nom ici." }]
  },
  {
    kanji: "聞", onyomi: "ブン", kunyomi: "き（きます）",
    vocab: [{ k: "新聞", r: "しんぶん", f: "Journal" }],
    phrases: [{ k: "ポッドキャストを聞きます。", r: "ポッドキャストをききます。", f: "J'écoute des podcasts." }]
  },
  // Group 3: 読・見・話・買・起
  {
    kanji: "読", onyomi: "ドク", kunyomi: "よ（みます）",
    vocab: [{ k: "読みます", r: "よみます", f: "Lire" }],
    phrases: [{ k: "本を読みます。", r: "ほんをよみます。", f: "Je lis un livre." }]
  },
  {
    kanji: "見", onyomi: "ケン", kunyomi: "み（ます）",
    vocab: [{ k: "見ます", r: "みます", f: "Voir/Regarder" }],
    phrases: [{ k: "映画を見ませんか。", r: "えいがをみませんか。", f: "Voulez-vous regarder un film ?" }]
  },
  {
    kanji: "話", onyomi: "ワ", kunyomi: "はな（します）",
    vocab: [{ k: "電話", r: "でんわ", f: "Téléphone" }],
    phrases: [{ k: "日本語で話しましょう。", r: "にほんごではなしましょう。", f: "Parlons en japonais." }]
  },
  {
    kanji: "買", onyomi: "バイ", kunyomi: "か（います）",
    vocab: [{ k: "買い物", r: "かいもの", f: "Courses" }],
    phrases: [{ k: "スーパーで買い物をします。", r: "スーパーでかいものをします。", f: "Je fais les courses au supermarché." }]
  },
  {
    kanji: "起", onyomi: "キ", kunyomi: "お（きます）",
    vocab: [{ k: "起きます", r: "おきます", f: "Se lever" }],
    phrases: [{ k: "明日、６時に起きます。", r: "あした、６じにおきます。", f: "Demain, je me lèverai à 6h." }]
  },
  // Group 4: 帰・友・達・茶・酒
  {
    kanji: "帰", onyomi: "キ", kunyomi: "かえ（ります）",
    vocab: [{ k: "帰ります", r: "かえります", f: "Rentrer" }],
    phrases: [{ k: "早く家に帰ります。", r: "はやくいえにかえります。", f: "Je rentre vite à la maison." }]
  },
  {
    kanji: "友", onyomi: "ユウ", kunyomi: "とも",
    vocab: [{ k: "友だち", r: "ともだち", f: "Ami" }],
    phrases: [{ k: "友だちと遊びます。", r: "ともだちとあそびます。", f: "Je joue avec des amis." }]
  },
  {
    kanji: "達", onyomi: "タツ", kunyomi: "たち",
    vocab: [{ k: "友達", r: "ともだち", f: "Ami(s)" }],
    phrases: [{ k: "わたしたちは友達です。", r: "わたしたちはともだちです。", f: "Nous sommes amis." }]
  },
  {
    kanji: "茶", onyomi: "チャ", kunyomi: "",
    vocab: [{ k: "お茶", r: "おちゃ", f: "Thé" }],
    phrases: [{ k: "一緒にお茶を飲みましょう。", r: "いっしょにおちゃをのみましょう。", f: "Buvons du thé ensemble." }]
  },
  {
    kanji: "酒", onyomi: "シュ", kunyomi: "さけ",
    vocab: [{ k: "日本酒", r: "にほんしゅ", f: "Saké japonais" }, { k: "お酒", r: "おさけ", f: "Alcool" }],
    phrases: [{ k: "お酒を飲みすぎました。", r: "おさけをのみすぎました。", f: "J'ai trop bu d'alcool." }]
  },
  // Group 5: 写・真・紙・映・画
  {
    kanji: "写", onyomi: "シャ", kunyomi: "うつ（します）",
    vocab: [{ k: "写真", r: "しゃしん", f: "Photo" }],
    phrases: [{ k: "写真を撮ってもいいですか。", r: "しゃしんをとってもいいですか。", f: "Puis-je prendre une photo ?" }]
  },
  {
    kanji: "真", onyomi: "シン", kunyomi: "ま",
    vocab: [{ k: "真ん中", r: "まんなか", f: "Milieu" }],
    phrases: [{ k: "写真がきれいですね。", r: "しゃしんがきれいですね。", f: "La photo est belle." }]
  },
  {
    kanji: "紙", onyomi: "シ", kunyomi: "かみ",
    vocab: [{ k: "手紙", r: "てがみ", f: "Lettre" }],
    phrases: [{ k: "母に手紙を書きました。", r: "ははにてがみをかきました。", f: "J'ai écrit une lettre à ma mère." }]
  },
  {
    kanji: "映", onyomi: "エイ", kunyomi: "うつ（します）",
    vocab: [{ k: "映画", r: "えいが", f: "Film" }],
    phrases: [{ k: "どんな映画が好きですか。", r: "どんなえいががすきですか。", f: "Quel genre de films aimez-vous ?" }]
  },
  {
    kanji: "画", onyomi: "ガ / カク", kunyomi: "",
    vocab: [{ k: "映画館", r: "えいがかん", f: "Cinéma" }, { k: "画家", r: "がか", f: "Peintre" }],
    phrases: [{ k: "彼は有名な画家です。", r: "かれはゆうめいながかです。", f: "Il est un peintre célèbre." }]
  },
  // Group 6: 店・英・語・送・切
  {
    kanji: "店", onyomi: "テン", kunyomi: "みせ",
    vocab: [{ k: "お店", r: "おみせ", f: "Magasin" }],
    phrases: [{ k: "このお店は有名です。", r: "このおみせはゆうめいです。", f: "Ce magasin est célèbre." }]
  },
  {
    kanji: "英", onyomi: "エイ", kunyomi: "",
    vocab: [{ k: "英語", r: "えいご", f: "Anglais" }],
    phrases: [{ k: "英国に行きたいです。", r: "えいこくにいきたいです。", f: "Je veux aller en Angleterre." }]
  },
  {
    kanji: "語", onyomi: "ゴ", kunyomi: "かた（ります）",
    vocab: [{ k: "日本語", r: "にほんご", f: "Japonais" }],
    phrases: [{ k: "フランス語を教えます。", r: "ふらんすごをおしえます。", f: "J'enseigne le français." }]
  },
  {
    kanji: "送", onyomi: "ソウ", kunyomi: "おく（ります）",
    vocab: [{ k: "送ります", r: "おくります", f: "Envoyer" }],
    phrases: [{ k: "荷物を送ります。", r: "にもつをおくります。", f: "J'envoie un colis." }]
  },
  {
    kanji: "切", onyomi: "セツ", kunyomi: "き（ります）",
    vocab: [{ k: "切手", r: "きって", f: "Timbre" }],
    phrases: [{ k: "野菜を切ります。", r: "やさいをきります。", f: "Je coupe les légumes." }]
  },
  // Group 7: 貸・借・旅・教・習
  {
    kanji: "貸", onyomi: "タイ", kunyomi: "か（します）",
    vocab: [{ k: "貸します", r: "かします", f: "Prêter" }],
    phrases: [{ k: "ペンを貸してください。", r: "ペンをかしてください。", f: "Prêtez-moi un stylo s'il vous plaît." }]
  },
  {
    kanji: "借", onyomi: "シャク", kunyomi: "か（ります）",
    vocab: [{ k: "借ります", r: "かりまｓ", f: "Emprunter" }],
    phrases: [{ k: "本を借りました。", r: "ほんをかりました。", f: "J'ai emprunté un livre." }]
  },
  {
    kanji: "旅", onyomi: "リョ", kunyomi: "たび",
    vocab: [{ k: "旅行", r: "りょこう", f: "Voyage" }],
    phrases: [{ k: "日本へ旅行に行きます。", r: "にほんへりょこうにいきます。", f: "Je pars en voyage au Japon." }]
  },
  {
    kanji: "教", onyomi: "キョウ", kunyomi: "おし（えます）",
    vocab: [{ k: "教えます", r: "おしえます", f: "Enseigner" }],
    phrases: [{ k: "フランス語を教えます。", r: "ふらんすごをおしえます。", f: "J'enseigne le français." }]
  },
  {
    kanji: "習", onyomi: "シュウ", kunyomi: "なら（います）",
    vocab: [{ k: "習います", r: "ならいます", f: "Apprendre" }],
    phrases: [{ k: "ピアノを習っています。", r: "ピアノをならっています。", f: "J'apprends le piano." }]
  },
  // Group 8: 勉・強・花・歩・待
  {
    kanji: "勉", onyomi: "ベン", kunyomi: "",
    vocab: [{ k: "勉強", r: "べんきょう", f: "Étude" }],
    phrases: [{ k: "毎日３時間勉強します。", r: "まいにち３じかんべんきょうします。", f: "J'étudie trois heures chaque jour." }]
  },
  {
    kanji: "強", onyomi: "キョウ", kunyomi: "つよ（い）",
    vocab: [{ k: "強い", r: "つよい", f: "Fort" }],
    phrases: [{ k: "風が強いですね。", r: "かぜがつよいですね。", f: "Le vent est fort, n'est-ce pas ?" }]
  },
  {
    kanji: "花", onyomi: "カ", kunyomi: "はな",
    vocab: [{ k: "花見", r: "はなみ", f: "Hanami" }, { k: "花屋", r: "はなや", f: "Fleuriste" }],
    phrases: [{ k: "公園でお花見をします。", r: "こうえんでおはなみをします。", f: "On fait un hanami au parc." }]
  },
  {
    kanji: "歩", onyomi: "ホ", kunyomi: "ある（きます）",
    vocab: [{ k: "歩道", r: "ほどう", f: "Trottoir" }],
    phrases: [{ k: "歩道を歩きましょう。", r: "ほどうをあるきましょう。", f: "Marchons sur le trottoir." }]
  },
  {
    kanji: "待", onyomi: "タイ", kunyomi: "ま（ちます）",
    vocab: [{ k: "待ちます", r: "まちます", f: "Attendre" }],
    phrases: [{ k: "駅で友だちを待ちます。", r: "えきでともだちをまちます。", f: "J'attends un ami à la gare." }]
  },
  // Group 9: 立・止・雨・入・出
  {
    kanji: "立", onyomi: "リツ", kunyomi: "た（ちます）",
    vocab: [{ k: "立ちます", r: "たちます", f: "Se tenir debout" }],
    phrases: [{ k: "あそこに立ってください。", r: "あそこにたってください。", f: "Veuillez vous tenir là-bas." }]
  },
  {
    kanji: "止", onyomi: "シ", kunyomi: "と（まります）",
    vocab: [{ k: "止まります", r: "とまります", f: "S'arrêter" }],
    phrases: [{ k: "車が止まりました。", r: "くるまがとまりました。", f: "La voiture s'est arrêtée." }]
  },
  {
    kanji: "雨", onyomi: "ウ", kunyomi: "あめ",
    vocab: [{ k: "大雨", r: "おおあめ", f: "Forte pluie" }],
    phrases: [{ k: "今日は大雨ですね。", r: "きょうはおおあめですね。", f: "C'est une forte pluie aujourd'hui." }]
  },
  {
    kanji: "入", onyomi: "ニュウ", kunyomi: "はい（ります）",
    vocab: [{ k: "入口", r: "いりぐち", f: "Entrée" }],
    phrases: [{ k: "入口はどこですか。", r: "いりぐちはどこですか。", f: "Où est l'entrée ?" }]
  },
  {
    kanji: "出", onyomi: "シュツ", kunyomi: "で（ます）",
    vocab: [{ k: "出口", r: "でぐち", f: "Sortie" }],
    phrases: [{ k: "出口から出ってください。", r: "でぐちからでてください。", f: "Veuillez sortir par la sortie." }]
  },
  // Group 10: 売・使・作・明・暗
  {
    kanji: "売", onyomi: "バイ", kunyomi: "う（ります）",
    vocab: [{ k: "売ります", r: "うります", f: "Vendre" }, { k: "売り切れ", r: "うりきれ", f: "Épuisé" }],
    phrases: [{ k: "古いゲームを売りました。", r: "ふるいゲームをうりました。", f: "J'ai vendu un vieux jeu." }]
  },
  {
    kanji: "使", onyomi: "シ", kunyomi: "つか（います）",
    vocab: [{ k: "使います", r: "つかいます", f: "Utiliser" }],
    phrases: [{ k: "パソコンを使いたいです。", r: "パソコンをつかいたいです。", f: "Je veux utiliser un ordinateur." }]
  },
  {
    kanji: "作", onyomi: "サク", kunyomi: "つく（ります）",
    vocab: [{ k: "作ります", r: "つくります", f: "Fabriquer" }],
    phrases: [{ k: "料理を作ります。", r: "りょうりをつくります。", f: "Je cuisine." }]
  },
  {
    kanji: "明", onyomi: "メイ", kunyomi: "あか（るい）",
    vocab: [{ k: "説明", r: "せつめい", f: "Explication" }, { k: "明日", r: "あした", f: "Demain" }],
    phrases: [{ k: "説明を読んでください。", r: "せつめいをよんでください。", f: "Veuillez lire l'explication." }]
  },
  {
    kanji: "暗", onyomi: "アン", kunyomi: "くら（い）",
    vocab: [{ k: "暗い", r: "くらい", f: "Sombre" }],
    phrases: [{ k: "外は暗いです。", r: "そとはくらいです。", f: "Il fait sombre dehors." }]
  },
  // Group 11: 広・多・少・長・短
  {
    kanji: "広", onyomi: "コウ", kunyomi: "ひろ（い）",
    vocab: [{ k: "広い", r: "ひろい", f: "Large/Spacieux" }],
    phrases: [{ k: "私のへやは広いです。", r: "わたしのへやはひろいです。", f: "Ma chambre est spacieuse." }]
  },
  {
    kanji: "多", onyomi: "タ", kunyomi: "おお（い）",
    vocab: [{ k: "多い", r: "おおい", f: "Beaucoup" }],
    phrases: [{ k: "パリには美術館が多いです。", r: "パリにはびじゅつかんがおおいです。", f: "Il y a beaucoup de musées à Paris." }]
  },
  {
    kanji: "少", onyomi: "ショウ", kunyomi: "すく（ない）",
    vocab: [{ k: "少ない", r: "すくない", f: "Peu" }, { k: "少し", r: "すこし", f: "Un peu" }],
    phrases: [{ k: "休みの日が少ないです。", r: "やすみのひがすくないです。", f: "Il y a peu de jours de congé." }]
  },
  {
    kanji: "長", onyomi: "チョウ", kunyomi: "なが（い）",
    vocab: [{ k: "長い", r: "ながい", f: "Long" }, { k: "社長", r: "しゃちょう", f: "Directeur" }],
    phrases: [{ k: "髪を長くしたいです。", r: "かみをながくしたいです。", f: "Je veux me laisser pousser les cheveux." }]
  },
  {
    kanji: "短", onyomi: "タン", kunyomi: "みじか（い）",
    vocab: [{ k: "短い", r: "みじかい", f: "Court" }],
    phrases: [{ k: "休みが短いです。", r: "やすみがみじかいです。", f: "Les vacances sont courtes." }]
  },
  // Group 12: 悪・重・軽・早・高
  {
    kanji: "悪", onyomi: "アク", kunyomi: "わる（い）",
    vocab: [{ k: "悪い", r: "わるい", f: "Mauvais" }],
    phrases: [{ k: "今日は天気が悪いですね。", r: "きょうはてんきがわるいですね。", f: "Le temps est mauvais aujourd'hui." }]
  },
  {
    kanji: "重", onyomi: "ジュウ", kunyomi: "おも（い）",
    vocab: [{ k: "重い", r: "おもい", f: "Lourd" }],
    phrases: [{ k: "この荷物は重いです。", r: "このにもつはおもいです。", f: "Ce colis est lourd." }]
  },
  {
    kanji: "軽", onyomi: "ケイ", kunyomi: "かる（い）",
    vocab: [{ k: "軽い", r: "かるい", f: "Léger" }],
    phrases: [{ k: "そのカバンは軽いですね。", r: "そのカバンはかるいですね。", f: "Ce sac est léger." }]
  },
  {
    kanji: "早", onyomi: "ソウ", kunyomi: "はや（い）",
    vocab: [{ k: "早く", r: "はやく", f: "Tôt/Vite" }],
    phrases: [{ k: "早く起きてください。", r: "はやくおきてください。", f: "Réveillez-vous tôt s'il vous plaît." }]
  },
  {
    kanji: "高", onyomi: "コウ", kunyomi: "たか（い）",
    vocab: [{ k: "高い", r: "たかい", f: "Haut/Cher" }],
    phrases: [{ k: "物価が高いですね。", r: "ぶっかがたかいですね。", f: "Le coût de la vie est élevé." }]
  }
];

// --- Components ---

const Header = ({ onHome }: { onHome: () => void }) => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 flex items-center justify-between">
    <button 
      onClick={onHome}
      className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:opacity-80 transition-opacity"
    >
      <Languages className="w-8 h-8" />
      <span>Kanji for My Class</span>
    </button>
    <div className="text-xs text-gray-400 font-mono hidden sm:block">
      60 ESSENTIAL KANJI
    </div>
  </header>
);

const HomeView = ({ onSelectMode }: { onSelectMode: (mode: 'list' | 'quiz') => void }) => (
  <div className="max-w-4xl mx-auto px-6 py-12">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Apprentissage des Kanji
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Maîtrisez les 60 Kanji essentiels à travers une liste détaillée et des quiz interactifs.
      </p>
    </motion.div>

    <div className="grid sm:grid-cols-2 gap-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectMode('list')}
        className="group relative overflow-hidden bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-xl transition-all text-left"
      >
        <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Book className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">漢字一覧</h2>
        <p className="text-gray-500">Consultez la liste complète des 60 Kanji avec lectures et exemples.</p>
        <div className="mt-6 flex items-center text-blue-600 font-semibold gap-2">
          <span>Voir la liste</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectMode('quiz')}
        className="group relative overflow-hidden bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm hover:border-orange-500 hover:shadow-xl transition-all text-left"
      >
        <div className="bg-orange-50 text-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">クイズ</h2>
        <p className="text-gray-500">Testez vos connaissances sur la lecture et l'écriture des Kanji.</p>
        <div className="mt-6 flex items-center text-orange-600 font-semibold gap-2">
          <span>Commencer</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.button>
    </div>
  </div>
);

const KanjiListView = ({ onBack }: { onBack: () => void }) => {
  const [search, setSearch] = useState('');
  
  const filteredKanji = useMemo(() => {
    return KANJI_DATA.filter(k => 
      k.kanji.includes(search) || 
      k.onyomi.includes(search) || 
      k.kunyomi.includes(search) ||
      k.vocab.some(v => v.f.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Rechercher un Kanji..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKanji.map((item, idx) => (
          <motion.div
            key={item.kanji}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.02 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-6xl font-bold text-gray-900 leading-none">{item.kanji}</div>
              <div className="text-right">
                <div className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1">On: {item.onyomi}</div>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">Kun: {item.kunyomi}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Vocabulaire</span>
                <div className="space-y-2">
                  {item.vocab.map((v, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-2 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900">{v.k}</span>
                        <span className="text-pink-600 font-medium text-xs">{v.r}</span>
                      </div>
                      <div className="text-gray-500 text-xs italic">{v.f}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Exemple</span>
                {item.phrases.map((p, i) => (
                  <div key={i} className="text-sm">
                    <div className="text-gray-900 font-medium mb-1">{p.k}</div>
                    <div className="text-gray-500 text-xs">{p.f}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const QuizView = ({ onBack }: { onBack: () => void }) => {
  const [category, setCategory] = useState<'vocab' | 'phrases' | null>(null);
  const [mode, setMode] = useState<'lecture' | 'ecriture' | null>(null);
  const [page, setPage] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const totalPages = Math.ceil(KANJI_DATA.length / 5);
  const currentItems = KANJI_DATA.slice(page * 5, (page + 1) * 5);

  if (!category || !mode) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
              Choisissez une catégorie
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setCategory('vocab')}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${category === 'vocab' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
              >
                <div className="font-bold text-xl mb-1">単語 (Vocabulaire)</div>
                <p className="text-sm text-gray-500">Testez des mots isolés.</p>
              </button>
              <button 
                onClick={() => setCategory('phrases')}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${category === 'phrases' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
              >
                <div className="font-bold text-xl mb-1">文 (Phrases)</div>
                <p className="text-sm text-gray-500">Testez des phrases complètes.</p>
              </button>
            </div>
          </section>

          <section className={!category ? 'opacity-30 pointer-events-none' : ''}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm">2</span>
              Choisissez un mode
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setMode('lecture')}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${mode === 'lecture' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
              >
                <div className="font-bold text-xl mb-1">読み (Lecture)</div>
                <p className="text-sm text-gray-500">Trouvez la lecture des Kanji.</p>
              </button>
              <button 
                onClick={() => setMode('ecriture')}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${mode === 'ecriture' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
              >
                <div className="font-bold text-xl mb-1">書き (Écriture)</div>
                <p className="text-sm text-gray-500">Trouvez le Kanji à partir de la lecture.</p>
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => { setCategory(null); setMode(null); }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Changer de mode</span>
        </button>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Page {page + 1} / {totalPages}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setPage(i); setShowAnswers(false); setShowHints(false); }}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {currentItems.map((item, idx) => {
            const quizItem = category === 'vocab' ? item.vocab[0] : item.phrases[0];
            return (
              <div key={idx} className="flex items-start gap-6 pb-6 border-b border-gray-50 last:border-0">
                <span className="text-blue-600 font-black text-xl pt-1">{(page * 5) + idx + 1}.</span>
                <div className="flex-1">
                  <div className="text-3xl font-medium text-gray-900 mb-2">
                    {mode === 'lecture' ? quizItem.k : quizItem.r}
                  </div>
                  
                  <AnimatePresence>
                    {showHints && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-gray-500 italic text-sm mb-2"
                      >
                        {quizItem.f}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showAnswers && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-green-50 text-green-700 p-3 rounded-xl inline-flex items-center gap-4"
                      >
                        <span className="font-bold text-xl">{quizItem.k}</span>
                        <span className="text-sm font-medium">【{quizItem.r}】</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowHints(!showHints)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${showHints ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          {showHints ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          <span>{showHints ? "Masquer Traduction" : "Voir Traduction"}</span>
        </button>
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${showAnswers ? 'bg-green-600 text-white shadow-green-200' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}
        >
          <span>{showAnswers ? "Masquer Réponses" : "Vérifier"}</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'list' | 'quiz'>('home');
  const [showPrep, setShowPrep] = useState(true);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 font-sans selection:bg-blue-100">
      <Header onHome={() => setView('home')} />
      
      <main>
        <AnimatePresence mode="wait">
          {showPrep && (
            <motion.div
              key="prep-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
              >
                <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Book className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Préparez-vous !</h2>
                <p className="text-gray-600 mb-2">
                  Veuillez préparer une feuille de papier et un stylo.
                </p>
                <p className="text-gray-600 mb-8 font-medium">
                  Écrivez vos réponses sur le papier.
                </p>
                <button
                  onClick={() => setShowPrep(false)}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Je suis prêt !
                </button>
              </motion.div>
            </motion.div>
          )}

          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomeView onSelectMode={setView} />
            </motion.div>
          )}
          
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <KanjiListView onBack={() => setView('home')} />
            </motion.div>
          )}

          {view === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuizView onBack={() => setView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 px-6 text-center text-gray-400 text-sm border-t border-gray-100 mt-12">
        <p>© 2024 Kanji for My Class - Apprentissage Interactif</p>
      </footer>
    </div>
  );
}
