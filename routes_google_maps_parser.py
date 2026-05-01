"""
Białostocka Piesza Pielgrzymka — parser tras Google Maps
=========================================================
Parsuje URL-e Google Maps dla każdego dnia pielgrzymki i generuje
znormalizowane pliki JSON gotowe do użycia w aplikacji mobilnej.
 
Użycie:
    python pilgrim_parser.py
 
Wyjście:
    output/manifest.json        — lista wszystkich dni
    output/day_01.json          — dzień 1
    output/day_02.json          — dzień 2
    ...
    output/day_14.json          — dzień 14
"""
 
import re
import json
import math
import os
import urllib.parse
from datetime import date, timedelta
 
# ---------------------------------------------------------------------------
# KONFIGURACJA — edytuj tylko tę sekcję
# ---------------------------------------------------------------------------
 
PILGRIMAGE_NAME = "Białostocka Piesza Pielgrzymka na Jasną Górę"
PILGRIMAGE_YEAR = 2025
START_DATE = date(2025, 7, 30)        # data dnia 1
OUTPUT_DIR = "data/pilgrimage_routes"  # katalog docelowy dla wygenerowanych plików JSON
 
# Tytuły dni
DAY_TITLES = {
    1:  "Białystok – Suraż",
    2:  "Suraż – Mień",
    3:  "Mień – Nur",
    4:  "Nur – Miedzna",
    5:  "Miedzna – Wierzbno",
    6:  "Wierzbno – Siennica",
    7:  "Siennica – Góra Kalwaria",
    8:  "Góra Kalwaria – Zbrosza Duża",
    9:  "Zbrosza Duża – Kostrzyn",
    10: "Kostrzyn – Gielniów",
    11: "Gielniów – Chełsty",
    12: "Chełsty – Strzelce Małe",
    13: "Strzelce Małe – Pacierzów",
    14: "Pacierzów – Jasna Góra",
}
 
# Nazwy przystanków per dzień (None = brak nazwy — będzie użyta tylko para lat/lon)
# Kolejność odpowiada waypointom wyekstrahowanym z data= sekcji URL-a
WAYPOINT_NAMES = {
    1:  ["Bazylika Wniebowzięcia NMP, Białystok",
         "Parafia św. Józefa Rzemieślnika, Księżyno",
         "Pomigacze",
         "Urząd Gminy Turośń Kościelna",
         None,
         "Parafia Bożego Ciała, Suraż"],
    2:  ["Kościół Bożego Ciała, Suraż",
         None,
         "Kościół św. Stanisława, Topczewo",
         "Sanktuarium MB Pojednania, Hodyszewo",
         None,
         None],
    3:  [None, None, None, None, None,
         "Parafia św. Jana Apostoła, Nur"],
    4:  ["Parafia św. Jana Apostoła, Nur",
         None,
         "Parafia NMP Narodzenia, Kosów Lacki",
         None,
         None,
         "Parafia Zwiastowania NMP, Miedzna"],
    5:  ["Parafia Zwiastowania NMP, Miedzna",
         "Bazylika Wniebowzięcia NMP, Węgrów",
         None,
         None,
         "Parafia śś. Piotra i Pawła, Wierzbno"],
    6:  ["Parafia śś. Piotra i Pawła, Wierzbno",
         "Kościół Wniebowzięcia NMP, Kałuszyn",
         "Parafia św. Teresy, Mrozy",
         None,
         None,
         "Parafia św. Stanisława, Siennica"],
    7:  ["Parafia św. Stanisława, Siennica",
         "Parafia św. Trójcy, Kołbiel",
         None,
         None,
         "Sanktuarium o. Papczyńskiego, Góra Kalwaria"],
    8:  ["Sanktuarium o. Papczyńskiego, Góra Kalwaria",
         None, None, None, None,
         "Zbrosza Duża"],
    9:  [None, None,
         "Parafia św. Trójcy, Białobrzegi",
         None, None,
         "Parafia św. Stanisława, Kostrzyn"],
    10: ["Kostrzyn",
         "Parafia św. Macieja, Klwów",
         None, None,
         "Kościół śś. Szymona i Judy Tadeusza, Gielniów",
         "Gielniów",
         None],
    11: [None,
         "Kościół św. Doroty i Aniołów, Petrykoza",
         "Kościół św. Jana Chrzciciela, Białaczów",
         "Ossa",
         None, None,
         "Kościół św. Mikołaja, Żarnów",
         "Parafia Miłosierdzia Bożego, Chełsty"],
    12: ["Chełsty", None, None, None, None,
         "Strzelce Małe"],
    13: ["Strzelce Małe", None, None, None, None, None, None],
    14: ["OSP Pacierzów",
         None,
         "Sanktuarium NMP Mstowskiej",
         "Sanktuarium o. Pio, Siedlec",
         "Jasna Góra, Częstochowa"],
}
 
# URL-e Google Maps — źródłowe dane importu (nie trafiają do wynikowego JSON per dzień)
SOURCE_URLS = {
    1:  "https://www.google.pl/maps/dir/Bazylika+Mniejsza+Wniebowzi%C4%99cia+NMP+w+Bia%C5%82ymstoku,+Ko%C5%9Bcielna+2,+15-087+Bia%C5%82ystok/Parafia+rzymskokatolicka+pw.+%C5%9Bw.+J%C3%B3zefa+Rzemie%C5%9Blnika,+Szkolna,+Ksi%C4%99%C5%BCyno/Pomigacze/Urz%C4%85d+Gminy+Turo%C5%9B%C5%84+Ko%C5%9Bcielna,+Bia%C5%82ostocka,+Turo%C5%9B%C5%84+Ko%C5%9Bcielna/52.979467,22.9944361/Parafia+rzymskokatolicka+pw.+Bo%C5%BCego+Cia%C5%82a,+Zako%C5%9Bcielna,+Sura%C5%BC/@52.9499991,22.9401945,2473m/data=!3m1!1e3!4m33!4m32!1m5!1m1!1s0x471ffc1cadff9497:0x882bfcfce7fca974!2m2!1d23.1630178!2d53.132637!1m5!1m1!1s0x471ffa315d907563:0xc8e213d3d5ea7997!2m2!1d23.1022551!2d53.0815914!1m5!1m1!1s0x471ff75324c1e809:0x4f21757ca73d3425!2m2!1d23.0861529!2d53.0367403!1m5!1m1!1s0x471ff3c4d23a0a3d:0x269f033610591928!2m2!1d23.0553281!2d53.0128225!1m0!1m5!1m1!1s0x471ff3a87bb5f353:0xda7a67be47751752!2m2!1d22.945333!2d52.9421977!3e2?entry=tts",
    2:  "https://www.google.pl/maps/dir/Ko%C5%9Bci%C3%B3%C5%82+Rzymskokatolicki+pw.+Bo%C5%BCego+Cia%C5%82a,+Zako%C5%9Bcielna+2,+18-105+Sura%C5%BC/52.8784405,22.9378141/Ko%C5%9Bci%C3%B3%C5%82+Rzymskokatolicki+pw.+%C5%9Bw.+Stanis%C5%82awa+Biskupa+i+M%C4%99czennika,+Bra%C5%84ska,+Topczewo/Sanktuarium+Matki+Bo%C5%BCej+Pojednania+w+Hodyszewie,+pp%C5%82k.+Platonoffa,+Hodyszewo/52.8004505,22.7408848/52.769831,22.6917524/@52.8556029,22.6577877,39649m/data=!3m2!1e3!4b1!4m23!4m22!1m5!1m1!1s0x471ff3a87bb5f353:0xda7a67be47751752!2m2!1d22.945333!2d52.9421977!1m0!1m5!1m1!1s0x471f8c6f72cd9481:0xc71f751446319f99!2m2!1d22.8932416!2d52.8453673!1m5!1m1!1s0x471f8e05e0b915d9:0x15a6e5a5cf0cdba6!2m2!1d22.7775472!2d52.8321369!1m0!1m0!3e2?entry=ttu",
    3:  "https://www.google.pl/maps/dir/52.7697928,22.694116/52.7628668,22.6248434/52.737911,22.5135347/52.7192147,22.4169402/52.6886162,22.3668011/Parafia+rzymskokatolicka+pw.+%C5%9Bw.+Jana+Aposto%C5%82a,+Ma%C5%82ki%C5%84ska,+Nur/@52.7207502,22.3404593,39772m/data=!3m2!1e3!4b1!4m13!4m12!1m0!1m0!1m0!1m0!1m0!1m5!1m1!1s0x471fa01067e99641:0x50f74f32e7960505!2m2!1d22.3158408!2d52.669963!3e2?entry=ttu",
    4:  "https://www.google.pl/maps/dir/Parafia+rzymskokatolicka+pw.+%C5%9Bw.+Jana+Aposto%C5%82a,+Ma%C5%82ki%C5%84ska+7,+07-322+Nur/52.6264749,22.2219587/Parafia+Rzymskokatolicka+Narodzenia+Naj%C5%9Bwi%C4%99tszej+Maryi+Panny,+Ko%C5%9Bcielna,+Kos%C3%B3w+Lacki/52.5994347,22.1700463/52.499532,22.063031/Parafia+Rzymskokatolicka+Zwiastowania+Naj%C5%9Bwi%C4%99tszej+Maryi+Panny,+Ko%C5%9Bcielna,+Miedzna/@52.569336,22.0231912,39910m/data=!3m2!1e3!4b1!4m23!4m22!1m5!1m1!1s0x471fa01067e99641:0x50f74f32e7960505!2m2!1d22.3158408!2d52.669963!1m0!1m5!1m1!1s0x471f0deca609d89b:0xe3fb33b084f32fcf!2m2!1d22.1463891!2d52.5970904!1m0!1m0!1m5!1m1!1s0x471f1307913531dd:0xae6a58e1dc911940!2m2!1d22.088521!2d52.4673575!3e2?entry=ttu",
    5:  "https://www.google.pl/maps/dir/Parafia+Rzymskokatolicka+Zwiastowania+Naj%C5%9Bwi%C4%99tszej+Maryi+Panny,+Ko%C5%9Bcielna+1a,+07-106+Miedzna/Bazylika+pw.+Wniebowzi%C4%99cia+Naj%C5%9Bwi%C4%99tszej+Marii+Panny+w+W%C4%99growie,+Stra%C5%BCacka,+W%C4%99gr%C3%B3w/52.3712146,21.9615768/52.3322966,21.9241079/Parafia+%C5%9Aw.+Aposto%C5%82%C3%B3w+Piotra+i+Paw%C5%82a,+Wierzbno/@52.3080742,21.8591562,843m/data=!3m1!1e3!4m27!4m26!1m5!1m1!1s0x471f1307913531dd:0xae6a58e1dc911940!2m2!1d22.088521!2d52.4673575!1m10!1m1!1s0x471f15ac88681797:0x21e2a9a9c5a0bee0!2m2!1d22.0192313!2d52.3988872!3m4!1m2!1d21.9659705!2d52.375804!3s0x471f15f3cb581103:0xae535c6dda7c5ccf!1m0!1m0!1m5!1m1!1s0x471f3c0fb65a5381:0x83661f139e97e1f5!2m2!1d21.8600307!2d52.3087497!3e2?entry=ttu",
    6:  "https://www.google.pl/maps/dir/Parafia+%C5%9Aw.+Aposto%C5%82%C3%B3w+Piotra+i+Paw%C5%82a,+07-111+Wierzbno/Ko%C5%9Bci%C3%B3%C5%82+Rzymskokatolicki+pw.+Wniebowzi%C4%99cia+NMP,+Mickiewicza,+Ka%C5%82uszyn/Parafia+rzymskokatolicka+%C5%9Bw.+Teresy+od+Dzieci%C4%85tka+Jezus,+%C5%9Bwi%C4%99tej+Teresy,+Mrozy/52.152752,21.7378704/52.1162554,21.6723946/Parafia+rzymskokatolicka+%C5%9Bw.+Stanis%C5%82awa,+Mi%C5%84ska,+Siennica/@52.2013311,21.5731713,46795m/data=!3m2!1e3!4b1!4m33!4m32!1m5!1m1!1s0x471f3c0fb65a5381:0x83661f139e97e1f5!2m2!1d21.8600307!2d52.3087497!1m10!1m1!1s0x471f3751c3f92abf:0x499f76ccae523511!2m2!1d21.8107272!2d52.2092236!3m4!1m2!1d21.8033497!2d52.1700093!3s0x471f36e74fb4d2bd:0xda1c2493cdd0cbe4!1m5!1m1!1s0x471f36dda6fc3e95:0x53a3ebf836e6056!2m2!1d21.7995271!2d52.1670112!1m0!1m0!1m5!1m1!1s0x4165538a2cac0ebb:0xe12a8dad34fb77e6!2m2!1d21.6156833!2d52.094142!3e2?entry=ttu",
    7:  "https://www.google.pl/maps/dir/Parafia+rzymskokatolicka+%C5%9Bw.+Stanis%C5%82awa,+Mi%C5%84ska+34,+05-332+Siennica/Parafia+rzymsko-katolicka+%C5%9Bw+Tr%C3%B3jcy,+Tadeusza+Ko%C5%9Bciuszki,+Ko%C5%82biel/52.0420946,21.3737971/52.0240009,21.3044912/Sanktuarium+%C5%9Bw.+ojca+Stanis%C5%82awa+Papczy%C5%84skiego+(Wieczernik),+Ojca+Papczy%C5%84skiego,+G%C3%B3ra+Kalwaria/@51.9929422,21.2292126,1678m/data=!3m1!1e3!4m42!4m41!1m10!1m1!1s0x4165538a2cac0ebb:0xe12a8dad34fb77e6!2m2!1d21.6156833!2d52.094142!3m4!1m2!1d21.5072615!2d52.0644025!3s0x4718d28d1009a08d:0xc12b35c32e47f192!1m5!1m1!1s0x4718d2f8f2c562b9:0x350be837b670b062!2m2!1d21.4798765!2d52.0615224!1m0!1m15!3m4!1m2!1d21.2399183!2d51.9970855!3s0x4718d7c07d44d70f:0x1026a3a1cb3334c1!3m4!1m2!1d21.2384713!2d51.9942912!3s0x4718d7ea9f0e1893:0xf2828e2298c51e5a!3m4!1m2!1d21.236367!2d51.9974374!3s0x4718d7c1b4081ba9:0xed0852a3df6fdf61!1m5!1m1!1s0x4718d9bb9a1d4eb7:0xc0b32ac4d0544aaa!2m2!1d21.2039046!2d51.976546!3e2?entry=ttu",
    8:  "https://www.google.com/maps/dir/Sanktuarium+%C5%9Bw.+ojca+Stanis%C5%82awa+Papczy%C5%84skiego+(Wieczernik),+ul,+Ojca+Papczy%C5%84skiego+6,+05-530+G%C3%B3ra+Kalwaria/51.9059031,21.166855/51.8592914,21.1128231/51.8166104,21.0714625/51.809874,20.9928629/Zbrosza+Du%C5%BCa/@51.9075115,21.173922,3331m/data=!3m1!1e3!4m28!4m27!1m10!1m1!1s0x4718d9bb9a1d4eb7:0xc0b32ac4d0544aaa!2m2!1d21.2039046!2d51.976546!3m4!1m2!1d21.1754512!2d51.9051052!3s0x4718d8c8a9b6b751:0x81ae70a3ad06e569!1m5!3m4!1m2!1d21.1151195!2d51.8612158!3s0x4718df9d2c2ab745:0x736cf31fec77f55b!1m0!1m0!1m0!1m5!1m1!1s0x47191dd76d300f39:0xa5d28014de26d1af!2m2!1d20.9604031!2d51.7561979!3e2?entry=tts",
    9:  "https://www.google.com/maps/dir/51.7559923,20.9588034/51.6796901,20.9585799/Parafia+%C5%9Awi%C4%99tej+Tr%C3%B3jcy+w+Bia%C5%82obrzegach,+Krakowska+25,+26-800+Bia%C5%82obrzegi/51.6322247,20.8936798/51.6256592,20.8129761/Parafia+%C5%9Bw.+Stanis%C5%82awa+w+Kostrzynie,+Kostrzyn/data=!4m22!4m21!1m1!4e1!1m1!4e1!1m5!1m4!1s0x4718fd69e81cb65b:0x8aecabe63669ff75!8m2!3d51.6511953!4d20.9535813!1m1!4e1!1m1!4e1!1m5!1m4!1s0x4719072b807ed1b5:0xb473ddbb63ac857c!8m2!3d51.576432399999995!4d20.7313935!3e2",
    10: "https://www.google.pl/maps/dir/Kostrzyn+72,+26-811+Kostrzyn/Parafia+pw.+%C5%9Bw.+Macieja,+Opoczy%C5%84ska,+Klw%C3%B3w/51.481883,20.6085377/51.473203,20.5633985/Ko%C5%9Bci%C3%B3%C5%82+%C5%9Bw.+Szymona+i+Judy+Tadeusza+w%E2%80%A6/Gielni%C3%B3w/51.371987,20.408338/@51.4180528,19.8328609,77128m/data=!3m1!1e3!4m29!4m28!1m5!1m1!1s0x4719072c7f86ba7b:0x49e87024b642f341!2m2!1d20.7315463!2d51.5763903!1m5!1m1!1s0x4719a83553c85513:0x7754ac3ad479b95!2m2!1d20.6347568!2d51.5342561!1m0!1m0!1m5!1m1!1s0x4719afedb915f06f:0xd171354fdf9fa19c!2m2!1d20.5011415!2d51.4227262!1m5!1m1!1s0x4719b0050b614ebd:0xfdea7eaffc7a5b69!2m2!1d20.482567!2d51.4004681!1m0!3e2?entry=ttu",
    11: "https://www.google.pl/maps/place/Ko%C5%9Bci%C3%B3%C5%82+%C5%9Bw.+Miko%C5%82aja+w+%C5%BBarnowie/@51.2936394,20.201351,19933m/data=!3m1!1e3!4m58!1m51!4m50!1m3!2m2!1d20.4084863!2d51.3719008!1m6!1m2!1s0x4719b9cbc4328409:0xddc4cb08536d7f91!2m2!1d20.3618293!2d51.303115!1m6!1m2!1s0x4719b8e60ffb050f:0x29eff4b0de7c8b38!2m2!1d20.2946031!2d51.3007616!1m16!1m2!1s0x4719bf54dbd791a7:0xcacc220cb9fb5426!2m2!1d20.2372364!2d51.2806111!3m4!1m2!1d20.2164063!2d51.2563211!3s0x4719c0cb762abd57:0x57bdd92d9d0fe864!3m4!1m2!1d20.2031665!2d51.2480186!3s0x4719c0d1896f8e8f:0xd16f86c77f5a00a1!1m6!1m2!1s0x4719c0e21ddc1d53:0x4a5c274aeb47db2f!2m2!1d20.1720836!2d51.2488834!1m6!1m2!1s0x4719c14334bde837:0x19e655584df0734c!2sParafia+Mi%C5%82osierdzia+Bo%C5%BCego+w+Che%C5%82stach,+Che%C5%82sty!2m2!1d20.1502297!2d51.2157154!3e2",
    12: "https://www.google.pl/maps/dir/26-330+Che%C5%82sty/51.206816,20.0340331/51.1654457,19.9926469/51.1238375,19.9601622/51.0861714,19.8745796/51.0992203,19.7915445/@51.0970768,19.7889144,1128m/data=!3m1!1e3!4m13!4m12!1m5!1m1!1s0x4719c14334bde837:0xe4043967c480111c!2m2!1d20.1613944!2d51.2148586!1m0!1m0!1m0!1m0!1m0!3e2?entry=ttu",
    13: "https://www.google.pl/maps/dir/97-515+Strzelce+Ma%C5%82e/51.0515225,19.665221/51.0321185,19.6250133/50.9991334,19.5187904/50.9661416,19.4701004/50.9382029,19.4250626/50.9067142,19.3999103/@50.9090621,19.4017972,843m/data=!3m1!1e3!4m14!4m13!1m5!1m1!1s0x4719e478d26754b5:0x5502ada10965f69a!2m2!1d19.793887!2d51.0978089!1m0!1m0!1m0!1m0!1m0!1m0!3e2?entry=ttu",
    14: "https://www.google.pl/maps/dir/Ochotnicza+Stra%C5%BC+Po%C5%BCarna+w+Pacierzowie,+Cz%C4%99stochowska+29,+42-270+Pacierz%C3%B3w/50.8589639,19.3548975/Sanktuarium+Naj%C5%9Bwi%C4%99tszej+Maryi+Panny+Mstowskiej/Sanktuarium+%C5%9Bw.+Ojca+Pio+na+Przepro%C5%9Bnej+G%C3%B3rce,+O%C5%9Bmiu+B%C5%82ogos%C5%82awie%C5%84stw,+Siedlec/Jasna+G%C3%B3ra,+ul.+o.+A.+Kordeckiego,+Cz%C4%99stochowa/@50.8130595,19.1060949,1588m/data=!3m1!1e3!4m27!4m26!1m5!1m1!1s0x471753864dd74acd:0xca16013dc04de789!2m2!1d19.3992336!2d50.9065513!1m0!1m5!1m1!1s0x47174b5f9c6b3ce7:0x72dc10404353c844!2m2!1d19.2888607!2d50.8327649!1m5!1m1!1s0x4710b4cba683d515:0x7c8344186c431230!2m2!1d19.23488!2d50.8199328!1m5!1m1!1s0x4710b67725190681:0xcdd96b8d5a77910!2m2!1d19.0970058!2d50.8125957!3e2?entry=ttu",
}
 
# ---------------------------------------------------------------------------
# PARSER
# ---------------------------------------------------------------------------
 
# Bounding box Polski — filtr fałszywych trafień
LAT_MIN, LAT_MAX = 49.0, 55.0
LON_MIN, LON_MAX = 14.0, 24.5
 
 
def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Odległość w km między dwoma punktami (wzór Haversine)."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 3)
 
 
def in_poland(lat: float, lon: float) -> bool:
    return LAT_MIN < lat < LAT_MAX and LON_MIN < lon < LON_MAX


def split_waypoint_name(raw_name: str | None) -> tuple[str | None, str | None]:
    """
    Rozdziela nazwę miejsca od miejscowości.

    Przykład:
      "Bazylika Wniebowzięcia NMP, Białystok"
      -> ("Bazylika Wniebowzięcia NMP", "Białystok")

    Jeśli nie ma jednoznacznego separatora, traktujemy cały tekst jako nazwę miejscowości,
    żeby nie dublować obu wierszy w harmonogramie.
    """
    if raw_name is None:
        return None, None

    cleaned_name = raw_name.strip()
    if not cleaned_name:
        return None, None

    parts = [part.strip() for part in cleaned_name.rsplit(",", 1)]
    if len(parts) == 2 and parts[0] and parts[1]:
        return parts[0], parts[1]

    return None, cleaned_name


def extract_coords_from_data_segment(url: str) -> list[tuple[float, float]]:
    """
    Wyciąga współrzędne z sekcji data= URL-a Google Maps.
    Format: !1d<lon>!2d<lat>  (długość geograficzna PRZED szerokością)
    """
    match = re.search(r'data=([^#]+)', url)
    if not match:
        return []
    data = match.group(1)
    pairs = re.findall(r'!1d(-?\d+\.\d+).*?!2d(-?\d+\.\d+)', data)
    result = []
    for lon_str, lat_str in pairs:
        lat, lon = float(lat_str), float(lon_str)
        if in_poland(lat, lon):
            result.append((round(lat, 7), round(lon, 7)))
    return result
 
 
def extract_coords_from_data_segment_8m(url: str) -> list[tuple[float, float]]:
    """
    Alternatywny format używany przez dzień 9: !3d<lat>!4d<lon>
    (stosowany przy 8m2! blokach w danych Places API)
    """
    match = re.search(r'data=([^#]+)', url)
    if not match:
        return []
    data = match.group(1)
    pairs = re.findall(r'!3d(-?\d+\.\d+).*?!4d(-?\d+\.\d+)', data)
    result = []
    for lat_str, lon_str in pairs:
        lat, lon = float(lat_str), float(lon_str)
        if in_poland(lat, lon):
            result.append((round(lat, 7), round(lon, 7)))
    return result
 
 
def extract_coords_from_path(url: str) -> list[tuple[float, float]]:
    """
    Wyciąga inline-coords z segmentów ścieżki, np. /52.123,22.456/
    """
    parsed = urllib.parse.urlparse(url)
    path = parsed.path
    result = []
    for m in re.finditer(r'/(-?\d{2,3}\.\d{4,8}),(-?\d{2,3}\.\d{4,8})(?=[/@]|$)', path):
        lat, lon = float(m.group(1)), float(m.group(2))
        if in_poland(lat, lon):
            result.append((round(lat, 7), round(lon, 7)))
    return result
 
 
def merge_coords(primary: list, secondary: list, dedup_radius_km: float = 0.5) -> list:
    """
    Łączy dwie listy współrzędnych — primary ma pierwszeństwo.
    Punkty z secondary dodawane są tylko jeśli nie ma bliskiego odpowiednika w primary.
    """
    merged = list(primary)
    for sc in secondary:
        too_close = any(haversine_km(sc[0], sc[1], pc[0], pc[1]) < dedup_radius_km for pc in merged)
        if not too_close:
            merged.append(sc)
    return merged
 
 
def parse_day(day: int, url: str) -> dict:
    """
    Parsuje URL Google Maps dla jednego dnia i zwraca znormalizowany słownik.
    """
    # 1. Wyciągnij współrzędne z data= (format !1d/!2d — najdokładniejszy)
    data_coords = extract_coords_from_data_segment(url)
 
    # 2. Fallback: format !3d/!4d (dzień 9 używa Places API)
    if len(data_coords) < 2:
        data_coords = extract_coords_from_data_segment_8m(url)
 
    # 3. Uzupełnij inline-coords ze ścieżki URL
    path_coords = extract_coords_from_path(url)
 
    # 4. Scal — data_coords jako primary
    all_coords = merge_coords(data_coords, path_coords)
 
    if not all_coords:
        raise ValueError(f"Dzień {day}: nie udało się wyciągnąć żadnych współrzędnych!")
 
    # 5. Pobierz nazwy przystanków
    names = WAYPOINT_NAMES.get(day, [])
 
    # 6. Zbuduj waypoints
    waypoints = []
    for i, (lat, lon) in enumerate(all_coords):
        raw_name = names[i] if i < len(names) else None
        name, town_name = split_waypoint_name(raw_name)
        waypoints.append({
            "orderIndex": i,
            "latitude": lat,
            "longitude": lon,
            "name": name,
            "townName": town_name,
            "distanceToNextKm": 0.0,  # wypełniane poniżej
        })
 
    # 7. Oblicz odległości między punktami i sumę
    total_km = 0.0
    for i in range(len(waypoints) - 1):
        d = haversine_km(
            waypoints[i]["latitude"], waypoints[i]["longitude"],
            waypoints[i + 1]["latitude"], waypoints[i + 1]["longitude"],
        )
        waypoints[i]["distanceToNextKm"] = d
        total_km += d
 
    day_date = START_DATE + timedelta(days=day - 1)
 
    return {
        "dayNumber": day,
        "title": DAY_TITLES[day],
        "date": day_date.isoformat(),
        "totalDistanceKm": round(total_km, 2),
        "startTown": waypoints[0]["townName"] or waypoints[0]["name"],
        "endTown": waypoints[-1]["townName"] or waypoints[-1]["name"],
        "waypointCount": len(waypoints),
        "waypoints": waypoints,
    }
 
 
# ---------------------------------------------------------------------------
# GŁÓWNA LOGIKA
# ---------------------------------------------------------------------------
 
def run():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    days_meta = []
    total_all_km = 0.0
 
    print(f"{'='*60}")
    print(f"  {PILGRIMAGE_NAME} {PILGRIMAGE_YEAR}")
    print(f"{'='*60}")
 
    for day in range(1, 15):
        url = SOURCE_URLS[day]
        try:
            data = parse_day(day, url)
        except Exception as e:
            print(f"  BŁĄD dzień {day:2d}: {e}")
            continue
 
        # Zapisz plik dnia
        filename = f"day_{day:02d}.json"
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
 
        total_all_km += data["totalDistanceKm"]
        days_meta.append({
            "dayNumber":        data["dayNumber"],
            "title":            data["title"],
            "date":             data["date"],
            "totalDistanceKm":  data["totalDistanceKm"],
            "waypointCount":    data["waypointCount"],
            "startTown":        data["startTown"],
            "endTown":          data["endTown"],
            "file":             filename,
        })
 
        print(
            f"  Dzień {day:2d}  {data['title']:<35s}"
            f"  {data['waypointCount']:2d} pkt  ~{data['totalDistanceKm']:5.1f} km"
        )
 
    # Zapisz manifest
    manifest = {
        "pilgrimageName": PILGRIMAGE_NAME,
        "year":           PILGRIMAGE_YEAR,
        "startDate":      START_DATE.isoformat(),
        "endDate":        (START_DATE + timedelta(days=13)).isoformat(),
        "totalDays":      14,
        "totalDistanceKm": round(total_all_km, 2),
        "days":           days_meta,
    }
    manifest_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
 
    print(f"{'='*60}")
    print(f"  Łączna odległość (w linii prostej): ~{total_all_km:.0f} km")
    print(f"  Pliki zapisane w: ./{OUTPUT_DIR}/")
    print(f"  manifest.json + day_01.json … day_14.json")
    print(f"{'='*60}")
 
 
if __name__ == "__main__":
    run()
