-- Seed data for CMS TagRobotech (MySQL)
-- Admin: admin@tagrobotech.com / Admin@123456

INSERT INTO media (id, original_name, file_name, file_url, mime_type, file_size, width, height, alt_text) VALUES
    ('a1000000-0000-4000-8000-000000000001', 'hero.webp', 'hero.webp', '/uploads/hero.webp', 'image/webp', 245760, 1920, 1080, 'TagRobotech hero banner'),
    ('a1000000-0000-4000-8000-000000000002', 'team1.webp', 'team1.webp', '/uploads/team1.webp', 'image/webp', 98304, 800, 800, 'Team member portrait'),
    ('a1000000-0000-4000-8000-000000000003', 'about-hero.webp', 'about-hero.webp', '/uploads/about-hero.webp', 'image/webp', 184320, 1600, 900, 'About page hero');

INSERT INTO admin_users (id, email, password_hash, name, is_active) VALUES
    ('b1000000-0000-4000-8000-000000000001', 'admin@tagrobotech.com', '$2b$12$0Q.kNkwsoJgZdPL7MJqMxuyGtYNBsbL4wUHt29y8aE1LH08qncqrS', 'CMS Admin', TRUE);

INSERT INTO pages (id, title, slug, page_type, status, sort_order) VALUES
    ('c1000000-0000-4000-8000-000000000001', 'Home', '/', 'page', 'published', 0),
    ('c1000000-0000-4000-8000-000000000002', 'About', 'about', 'page', 'published', 1),
    ('c1000000-0000-4000-8000-000000000003', 'Careers', 'careers', 'page', 'draft', 2),
    ('c1000000-0000-4000-8000-000000000004', 'RFID Services', 'rfid-services', 'service', 'published', 3),
    ('c1000000-0000-4000-8000-000000000005', 'Future of RFID', 'future-of-rfid', 'blog', 'published', 4);

INSERT INTO page_sections (page_id, section_type, position, is_active, data) VALUES
    ('c1000000-0000-4000-8000-000000000001', 'hero', 1, TRUE, JSON_OBJECT(
        'heading', 'Welcome to TagRobotech',
        'description', 'Transforming Asset Auditing with RFID and Barcode Tracking Solutions',
        'button_text', 'Contact Us',
        'button_link', '/contact',
        'image_id', 'a1000000-0000-4000-8000-000000000001'
    )),
    ('c1000000-0000-4000-8000-000000000001', 'about', 2, TRUE, JSON_OBJECT(
        'tagline', 'About Us',
        'heading', 'Pioneers of',
        'heading_accent', 'Asset Tracking',
        'paragraphs', JSON_ARRAY(
            'Tag RoBo Tech pioneered enterprise asset tracking in India — among the first in the industry to unify RFID, IoT, BLE, and robotics into scalable tracking solutions.',
            'Tag RoBo Tech designs solutions by leveraging the core strengths of different types of tags, robotics, and technology.',
            'Over last 10 years, we have implemented solutions to track assets, inventory, finished goods, tools, fleet, delivery, consumables, employees, documentation, remote sites etc.. almost everything that needs to be tracked!',
            'Our technology platform applies innovative science to not only track but also collect/ transform data which can be used for operational intelligence...'
        ),
        'visual_type', 'spline',
        'spline_scene_url', 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
        'image_id', NULL
    )),
    ('c1000000-0000-4000-8000-000000000001', 'stats', 3, TRUE, JSON_OBJECT(
        'items', JSON_ARRAY(
            JSON_OBJECT('label', 'Assets Tracked', 'value', '10M+'),
            JSON_OBJECT('label', 'Enterprise Clients', 'value', '150+'),
            JSON_OBJECT('label', 'Years Experience', 'value', '15+')
        )
    )),
    ('c1000000-0000-4000-8000-000000000001', 'faq', 4, TRUE, JSON_OBJECT(
        'heading', 'Frequently Asked Questions',
        'items', JSON_ARRAY(
            JSON_OBJECT(
                'question', 'What is RFID auditing?',
                'answer', 'RFID auditing uses radio-frequency identification to automatically track and verify physical assets without line-of-sight scanning.'
            ),
            JSON_OBJECT(
                'question', 'How long does implementation take?',
                'answer', 'Typical enterprise deployments range from 4-12 weeks depending on site count and integration complexity.'
            )
        )
    )),
    ('c1000000-0000-4000-8000-000000000001', 'cta', 5, TRUE, JSON_OBJECT(
        'heading', 'Ready to modernize your asset tracking?',
        'button_text', 'Get Started',
        'button_link', '/contact'
    ));

INSERT INTO page_sections (page_id, section_type, position, is_active, data) VALUES
    ('c1000000-0000-4000-8000-000000000002', 'hero', 1, TRUE, JSON_OBJECT(
        'heading', 'About TagRobotech',
        'description', 'Pioneers of enterprise asset tracking in India',
        'image_id', 'a1000000-0000-4000-8000-000000000003'
    )),
    ('c1000000-0000-4000-8000-000000000002', 'rich_text', 2, TRUE, JSON_OBJECT(
        'content', '<p>Tag RoBo Tech pioneered enterprise asset tracking in India — RFID, IoT, BLE, and robotics solutions for assets, inventory, fleet, and more.</p>'
    )),
    ('c1000000-0000-4000-8000-000000000002', 'team', 3, TRUE, JSON_OBJECT(
        'heading', 'Our Leadership',
        'members', JSON_ARRAY(
            JSON_OBJECT('name', 'Leadership Team', 'role', 'Founders', 'image_id', 'a1000000-0000-4000-8000-000000000002')
        )
    ));

INSERT INTO page_sections (page_id, section_type, position, is_active, data) VALUES
    ('c1000000-0000-4000-8000-000000000004', 'hero', 1, TRUE, JSON_OBJECT(
        'heading', 'RFID Services',
        'description', 'End-to-end RFID deployment, integration, and support',
        'button_text', 'Request a Demo',
        'button_link', '/contact'
    )),
    ('c1000000-0000-4000-8000-000000000004', 'services', 2, TRUE, JSON_OBJECT(
        'items', JSON_ARRAY(
            JSON_OBJECT('title', 'Asset Auditing', 'description', 'Automated physical verification at scale'),
            JSON_OBJECT('title', 'Inventory Management', 'description', 'Real-time stock visibility across locations'),
            JSON_OBJECT('title', 'Integration', 'description', 'ERP and WMS connectivity')
        )
    ));

INSERT INTO page_seo (page_id, meta_title, meta_description, meta_keywords, robots, og_title, og_description, og_image_id, schema_json) VALUES
    ('c1000000-0000-4000-8000-000000000001',
        'TagRobotech | Asset Auditing Solutions',
        'RFID and barcode asset tracking company. Enterprise asset auditing, inventory management, and IoT solutions.',
        'RFID, asset tracking, barcode, enterprise auditing',
        'index,follow',
        'TagRobotech | Asset Auditing Solutions',
        'RFID and barcode asset tracking company.',
        'a1000000-0000-4000-8000-000000000001',
        JSON_OBJECT('@context', 'https://schema.org', '@type', 'Organization', 'name', 'TagRobotech', 'url', 'https://tagrobotech.com')),
    ('c1000000-0000-4000-8000-000000000002',
        'About TagRobotech | Enterprise Asset Tracking',
        'Learn about TagRobotech — pioneers of RFID and IoT asset tracking in India.',
        'about, RFID company, asset tracking India',
        'index,follow',
        'About TagRobotech',
        'Pioneers of enterprise asset tracking in India.',
        'a1000000-0000-4000-8000-000000000003',
        NULL),
    ('c1000000-0000-4000-8000-000000000004',
        'RFID Services | TagRobotech',
        'Professional RFID deployment, asset auditing, and integration services.',
        'RFID services, asset auditing, inventory RFID',
        'index,follow',
        'RFID Services | TagRobotech',
        'End-to-end RFID deployment and support.',
        NULL,
        NULL),
    ('c1000000-0000-4000-8000-000000000005',
        'The Future of RFID | TagRobotech Blog',
        'How RFID technology is reshaping enterprise asset management.',
        'RFID blog, future of RFID, asset management',
        'index,follow',
        'The Future of RFID',
        'How RFID is reshaping enterprise asset management.',
        NULL,
        JSON_OBJECT('@context', 'https://schema.org', '@type', 'BlogPosting', 'headline', 'The Future of RFID'));
