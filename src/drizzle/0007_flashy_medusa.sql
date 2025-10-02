DROP TABLE `home_assistant_connections`;--> statement-breakpoint
ALTER TABLE `appearance_settings` ADD `primary_color` text DEFAULT '#3b82f6' NOT NULL;--> statement-breakpoint
ALTER TABLE `appearance_settings` ADD `card_placeholder_color` text DEFAULT '#9ca3af' NOT NULL;--> statement-breakpoint
ALTER TABLE `appearance_settings` ADD `theme_preset` text DEFAULT 'default' NOT NULL;