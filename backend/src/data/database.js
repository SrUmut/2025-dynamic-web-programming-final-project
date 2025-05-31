const { Pool } = require("pg");

const pool = new Pool();

async function getClient() {
    return await pool.connect();
}

async function initDB() {
    const client = await getClient();

    const query = `
CREATE TABLE IF NOT EXISTS city (
	id TEXT PRIMARY KEY,
	city_name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS flight (
	id TEXT PRIMARY KEY,
	from_city TEXT references city(id) ON DELETE CASCADE,
	to_city TEXT references city(id) ON DELETE CASCADE,
	departure_time TIMESTAMPTZ,
	arrival_time TIMESTAMPTZ,
	price NUMERIC(10, 2),
	seats_total SMALLINT,
	seats_available SMALLINT,
	CONSTRAINT unique_from_departure UNIQUE (from_city, departure_time),
	CONSTRAINT unique_to_arrival UNIQUE (to_city, arrival_time)
);

CREATE TABLE IF NOT EXISTS ticket (
	id TEXT PRIMARY KEY,
	passenger_name TEXT,
	passenger_surname TEXT,
	passenger_email TEXT,
	flight_id TEXT references flight(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin (
	username TEXT PRIMARY KEY,
	password TEXT
);

INSERT INTO city (id, city_name)
SELECT id, city_name
FROM(VALUES
  ('01','Adana'),
  ('02','Adıyaman'),
  ('03','Afyonkarahisar'),
  ('04','Ağrı'),
  ('05','Amasya'),
  ('06','Ankara'),
  ('07','Antalya'),
  ('08','Artvin'),
  ('09','Aydın'),
  ('10','Balıkesir'),
  ('11','Bilecik'),
  ('12','Bingöl'),
  ('13','Bitlis'),
  ('14','Bolu'),
  ('15','Burdur'),
  ('16','Bursa'),
  ('17','Çanakkale'),
  ('18','Çankırı'),
  ('19','Çorum'),
  ('20','Denizli'),
  ('21','Diyarbakır'),
  ('22','Edirne'),
  ('23','Elazığ'),
  ('24','Erzincan'),
  ('25','Erzurum'),
  ('26','Eskişehir'),
  ('27','Gaziantep'),
  ('28','Giresun'),
  ('29','Gümüşhane'),
  ('30','Hakkari'),
  ('31','Hatay'),
  ('32','Isparta'),
  ('33','Mersin'),
  ('34','İstanbul'),
  ('35','İzmir'),
  ('36','Kars'),
  ('37','Kastamonu'),
  ('38','Kayseri'),
  ('39','Kırklareli'),
  ('40','Kırşehir'),
  ('41','Kocaeli'),
  ('42','Konya'),
  ('43','Kütahya'),
  ('44','Malatya'),
  ('45','Manisa'),
  ('46','Kahramanmaraş'),
  ('47','Mardin'),
  ('48','Muğla'),
  ('49','Muş'),
  ('50','Nevşehir'),
  ('51','Niğde'),
  ('52','Ordu'),
  ('53','Rize'),
  ('54','Sakarya'),
  ('55','Samsun'),
  ('56','Siirt'),
  ('57','Sinop'),
  ('58','Sivas'),
  ('59','Tekirdağ'),
  ('60','Tokat'),
  ('61','Trabzon'),
  ('62','Tunceli'),
  ('63','Şanlıurfa'),
  ('64','Uşak'),
  ('65','Van'),
  ('66','Yozgat'),
  ('67','Zonguldak'),
  ('68','Aksaray'),
  ('69','Bayburt'),
  ('70','Karaman'),
  ('71','Kırıkkale'),
  ('72','Batman'),
  ('73','Şırnak'),
  ('74','Bartın'),
  ('75','Ardahan'),
  ('76','Iğdır'),
  ('77','Yalova'),
  ('78','Karabük'),
  ('79','Kilis'),
  ('80','Osmaniye'),
  ('81','Düzce')
) AS v(id, city_name)
WHERE NOT EXISTS (SELECT 1 FROM city);

INSERT INTO admin (username, password)
SELECT username, password
FROM(VALUES
    ('admin', '$2b$10$tcy19SeR0SWtKjVjubMoFOOnB25rmGod3yPFGFGzqYZEuC9zWmGvi')
) AS v(username, password)
WHERE NOT EXISTS (SELECT 1 FROM admin);

drop view if exists flights;

create view flights as
select 
	f.id as id, 
	cf.city_name as from_city, 
	ct.city_name as to_city, 
	departure_time, 
	arrival_time, 
	price, 
	seats_available, 
	seats_total
FROM flight f
inner join city cf on f.from_city = cf.id
inner join city ct on f.to_city = ct.id;`;

    await client.query(query);
    client.release();
}

initDB();

module.exports = {
    getClient,
    pool,
};
