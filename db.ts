import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'brewella.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    user_role TEXT CHECK(user_role IN ('Admin', 'Normal User')) NOT NULL DEFAULT 'Normal User',
    status TEXT CHECK(status IN ('Active', 'Suspended')) NOT NULL DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS cafe_tables (
    table_id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    area TEXT DEFAULT 'Main Hall'
  );

  CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    table_id INTEGER NOT NULL,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    guest_count INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_email TEXT,
    special_request TEXT,
    status TEXT CHECK(status IN ('Pending', 'Confirmed', 'Checked-in', 'Cancelled', 'Completed')) NOT NULL DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (table_id) REFERENCES cafe_tables (table_id)
  );

  CREATE TABLE IF NOT EXISTS issues (
    issue_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK(status IN ('Open', 'Closed')) NOT NULL DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
  );

  CREATE TABLE IF NOT EXISTS issue_comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues (issue_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
  );

  CREATE TABLE IF NOT EXISTS menus (
    menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_name TEXT,
    menu_image_path TEXT,
    menu_description TEXT,
    menu_price REAL,
    uploaded_user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_user_id) REFERENCES users (user_id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_path TEXT,
    post_type TEXT CHECK(post_type IN ('news', 'event')) NOT NULL DEFAULT 'news',
    status TEXT CHECK(status IN ('published', 'draft')) NOT NULL DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS post_comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS post_reactions (
    reaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    reaction_type TEXT CHECK(reaction_type IN ('like', 'love', 'wow', 'sad', 'angry')) NOT NULL DEFAULT 'like',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    UNIQUE (post_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS shop_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert initial data if empty
const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

if (usersCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (user_id, first_name, last_name, email, password, user_role, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const insertUserTx = db.transaction(() => {
    insertUser.run(1, 'Phoenix', 'Zan', 'Phoenix123@gmail.com', '$2y$10$S8T8Hz6j5vrlIJv5/dfqiOr95OHKv3C47dn7K/VPAuEKbxn40n9Ee', 'Admin', 'Active');
    insertUser.run(2, 'Heinn', 'Zan', 'heinn2004@gmail.com', '$2y$10$z1fOT7z4dQU9eIAY3WkAquNZhD58oLgh/5lkNsvluy8JOqXdezRny', 'Admin', 'Active');
    insertUser.run(3, 'Zar', 'Zar', 'zarzarlay123@gmail.com', '$2y$10$.EayCoNxoUnTiWTSrCa94OYhe1X4u2G0x8EdFD.IfpO4XNby732N.', 'Normal User', 'Active');
    insertUser.run(4, 'Choco', 'Choco', 'Choco@gmail.com', '$2y$10$hwIZyw9vkKKktC/068kFz.iby/QUqsi4lgTJSru2QlqsV8Aae/pdu', 'Normal User', 'Active');
    insertUser.run(5, 'Nix', 'Nix', 'Nix@gmail.com', '$2y$10$yMjCJYlplDmniD4Imdz28OvUvZ.kctAqiSXmJjr/X1SgnKAsYRmP.', 'Normal User', 'Active');
    insertUser.run(6, 'JM', 'JM', 'jm123@gmail.com', '$2y$10$sgnOF9KSKh7zfLm0TNuH5.egviH3AaYnE05///5/LMxrbcV6nAdoO', 'Normal User', 'Suspended');
    insertUser.run(7, 'Test', 'User', 'TestUser123@gmail.com', '$2y$10$ldsX.8EV0csXqjaQvgOV9efb53pq/UF54It34ESzf/x8zyf8kPehu', 'Normal User', 'Active');
  });
  insertUserTx();

  const insertTable = db.prepare('INSERT INTO cafe_tables (table_id, table_number, capacity, area) VALUES (?, ?, ?, ?)');
  const insertTableTx = db.transaction(() => {
    insertTable.run(1, 'T1', 2, 'Main Hall');
    insertTable.run(2, 'T2', 2, 'Main Hall');
    insertTable.run(3, 'T3', 4, 'Main Hall');
    insertTable.run(4, 'T4', 4, 'Main Hall');
    insertTable.run(5, 'T5', 6, 'Main Hall');
    insertTable.run(6, 'T6', 6, 'Main Hall');
    insertTable.run(7, 'T7', 8, 'VIP Room');
    insertTable.run(8, 'T8', 4, 'In the garden');
    insertTable.run(9, 'T9', 2, 'In the garden');
    insertTable.run(10, 'T10', 3, 'Rooftop');
    insertTable.run(11, 'T11', 4, 'Rooftop');
    insertTable.run(12, 'T12', 4, 'Rooftop');
    insertTable.run(13, 'T13', 2, 'Rooftop');
    insertTable.run(14, 'T14', 2, 'In the garden');
    insertTable.run(15, 'T15', 5, 'VIP Room');
    insertTable.run(16, 'T16', 2, 'VIP Room');
    insertTable.run(17, 'T17', 6, 'Main Hall');
    insertTable.run(18, 'T18', 3, 'In the garden');
    insertTable.run(19, 'T19', 3, 'Main Hall');
    insertTable.run(20, 'T20', 4, 'Main Hall');
    insertTable.run(21, 'T21', 4, 'Main Hall');
    insertTable.run(22, 'T22', 6, 'Main Hall');
    insertTable.run(23, 'T23', 4, 'Rooftop');
    insertTable.run(24, 'T24', 6, 'In the garden');
    insertTable.run(25, 'T25', 8, 'VIP Room');
    insertTable.run(26, 'T26', 2, 'Main Hall');
    insertTable.run(27, 'T27', 2, 'Rooftop');
    insertTable.run(28, 'T28', 6, 'Rooftop VIP Room');
    insertTable.run(29, 'T29', 8, 'Rooftop VIP Room');
    insertTable.run(30, 'T30', 2, 'Rooftop VIP Room');
    insertTable.run(31, 'T31', 2, 'Rooftop VIP Room');
    insertTable.run(32, 'T32', 4, 'Rooftop VIP Room');
  });
  insertTableTx();

  const insertMenu = db.prepare('INSERT INTO menus (menu_id, menu_name, menu_image_path, menu_description, menu_price, uploaded_user_id) VALUES (?, ?, ?, ?, ?, ?)');
  const insertMenuTx = db.transaction(() => {
    insertMenu.run(1, 'Espresso', '', 'A bold, concentrated shot of pure coffee ☕🔥, crafted to deliver maximum flavor and energy in a tiny cup. Perfect for true coffee lovers who crave intensity.', 5600, 1);
    insertMenu.run(2, 'Americano', '', 'Smooth and balanced 🌊☕, made by blending rich espresso with hot water. Ideal for those who enjoy a lighter but full-bodied coffee.', 6600, 1);
    insertMenu.run(3, 'Cappuccino', '', 'A delightful harmony 🎶 of strong espresso, creamy steamed milk, and airy milk foam ☁️. Topped with a sprinkle of cocoa or cinnamon for a cozy treat.', 6600, 1);
    insertMenu.run(4, 'Latte', '', 'Silky and comforting 🥛☕, combining robust espresso with velvety steamed milk. A classic favorite for an all-day coffee fix.', 5000, 1);
    insertMenu.run(5, 'Mocha', '', 'A chocolate lover’s dream 🍫☕, this drink blends espresso, steamed milk, and chocolate syrup, crowned with whipped cream for indulgence.', 6600, 1);
    insertMenu.run(6, 'Flat White', '', 'Smooth and refined ✨, featuring a rich espresso base topped with micro-foam milk. A creamy but bold coffee experience.', 6600, 1);
    insertMenu.run(7, 'Macchiato', '', 'Espresso “kissed” with just a touch of foamed milk 💋☕. Strong and simple, perfect for when you want coffee with a hint of softness.', 5000, 1);
    insertMenu.run(8, 'Caramel Macchiato', '', 'A sweet classic 🍯☕, layering espresso, milk, and vanilla syrup, finished with golden caramel drizzle for a perfect balance.', 6000, 1);
    insertMenu.run(9, 'Cold Brew', '', 'Slowly steeped in cold water for 12+ hours ❄️🥶, this coffee is smooth, low in acidity, and deeply refreshing. Great for hot days.', 6500, 1);
    insertMenu.run(10, 'Iced Latte', '', 'Cool and creamy ❄️🥛☕, made with espresso poured over ice and topped with chilled milk. A refreshing twist on the classic latte.', 6800, 1);
    insertMenu.run(11, 'Iced Mocha', '', 'Chocolatey and refreshing 🍫❄️☕, this iced delight mixes espresso, milk, and rich chocolate syrup for a sweet energy boost.', 7000, 1);
    insertMenu.run(12, 'Matcha Latte', '', 'A vibrant green tea experience 🍵💚, blending ceremonial-grade matcha with steamed milk. Earthy, creamy, and antioxidant-rich.', 6600, 1);
    insertMenu.run(13, 'Chai Latte', '', 'Warm and spiced 🌿🍂, this drink infuses black tea with cinnamon, cardamom, ginger, and milk for a comforting hug in a cup.', 6000, 1);
    insertMenu.run(14, 'Hot Chocolate', '', 'Creamy, cozy, and sweet 🍫☁️, topped with whipped cream and maybe a sprinkle of cocoa. A nostalgic favorite for all ages.', 6000, 1);
    insertMenu.run(15, 'Vanilla Latte', '', 'Smooth espresso paired with steamed milk 🌸☕, infused with fragrant vanilla syrup for a sweet and delicate flavor.', 6800, 1);
    insertMenu.run(16, 'Hazelnut Latte', '', 'A nutty, aromatic twist 🌰☕, where espresso and steamed milk meet the sweetness of hazelnut syrup. Comfort in a cup.', 7000, 1);
    insertMenu.run(17, 'Pumpkin Spice Latte', '', 'Autumn in a cup 🍁🎃☕, blending espresso, milk, and pumpkin spice flavors of cinnamon, nutmeg, and clove. A seasonal favorite!', 7000, 1);
    insertMenu.run(18, 'Affogato', '', 'A luxurious dessert-drink 🍨☕, where hot espresso is poured over cold vanilla ice cream, creating a contrast of temperatures and flavors.', 7000, 1);
    insertMenu.run(19, 'Croissant', '', 'Flaky, buttery, and golden 🥐✨, freshly baked every morning. Perfect on its own or paired with your favorite coffee.', 3000, 1);
    insertMenu.run(20, 'Blueberry Muffin', '', 'Soft, moist, and bursting with blueberries 🫐🧁. A sweet bakery treat that pairs beautifully with a hot cup of coffee.', 4000, 1);
    insertMenu.run(21, 'Strawberry Cheesecake', '', 'A creamy, dreamy dessert 🍓🍰✨ with a buttery graham cracker crust, rich cheesecake filling, and a luscious strawberry topping. Sweet, tangy, and indulgent — the perfect treat to enjoy alongside your favorite coffee.', 5500, 1);
  });
  insertMenuTx();

  const insertPost = db.prepare('INSERT INTO posts (post_id, user_id, title, content, image_path, post_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const insertPostTx = db.transaction(() => {
    insertPost.run(1, 1, '☕ Myanmar Coffee & Culture Night', '🌿 Event Highlights\r\n\r\nSpecial Menu for the Night\r\n\r\nBurmese Coffee (လက်ဖက်ရည်ကြမ်း စတိုင်) – Rich, sweet, and creamy coffee with condensed milk.\r\n\r\nLaphet Yay (လက်ဖက်ရည်) – Traditional Burmese milk tea.\r\n\r\nShan-style snacks – Like tofu fritters, mont lone yay paw (sweet glutinous rice balls), and samosas.\r\n\r\nBurmese Dessert Corner – Mont pyar tha let (pancakes), mont lone yay paw, or coconut jelly.\r\n\r\nCultural Touch\r\n\r\nSoft background Burmese acoustic music 🎶.\r\n\r\nDecorations with thanaka patterns, lotus flowers, and traditional fabrics.\r\n\r\nOptional: Invite a local Burmese acoustic guitarist or harp (saung) player.\r\n\r\nInteractive Segment\r\n\r\nCoffee Tasting Flight – Let guests try different Myanmar coffee beans (Shan, Chin, Mandalay regions).\r\n\r\nMini Workshop – Teach how to brew Burmese-style sweet coffee or laphet yay.\r\n\r\nPhoto Corner – Traditional parasols (ထီး), longyi patterns, and tea baskets for fun pictures.\r\n\r\nCommunity Activity\r\n\r\nDonation box for a local Myanmar cause (education, farmers, or coffee growers).\r\n\r\nShowcase artwork or crafts from Burmese artists.\r\n\r\n📅 Suggested Timing:\r\n\r\nEvening (6 PM – 9 PM) for a relaxed, cultural vibe.\r\n\r\nCan be monthly or once every two months as a themed event.', '', 'event', 'published');
    insertPost.run(2, 2, 'New Autumn Menu ❄️⛄', '🍂 New on the Menu: Hazelnut Latte 🌰☕\r\n\r\nFall just got a little toastier! Introducing our Hazelnut Latte – smooth espresso, steamed milk, and rich, nutty hazelnut syrup topped with a warm sprinkle of cinnamon. It’s the hug-in-a-mug you’ve been waiting for. 💛\r\n\r\nSwing by Brewella and sip into the season. Available hot or iced — because autumn weather likes to keep us guessing. 😉\r\n\r\n#BrewellaCafe #HazelnutLatte #FallFlavors #AutumnVibes #CoffeeSeason', '', 'news', 'published');
    insertPost.run(3, 2, '📖☕ Study & Sip at Brewella', 'Need a productive space with great coffee? Brewella is hosting a Study & Sip session!\r\n\r\nEnjoy a quiet, cozy environment, free WiFi, and special student discounts on selected drinks.\r\n\r\nBring your laptop, your notes, and let Brewella fuel your focus.', '', 'news', 'published');
  });
  insertPostTx();

  const insertSettings = db.prepare('INSERT INTO shop_settings (setting_key, setting_value) VALUES (?, ?)');
  const insertSettingsTx = db.transaction(() => {
    insertSettings.run('closing_time', '22:00');
    insertSettings.run('opening_time', '08:00');
    insertSettings.run('shop_status', 'open');
  });
  insertSettingsTx();
}

export default db;
