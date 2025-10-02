import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { appearanceSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const settings = await db.select()
      .from(appearanceSettings)
      .limit(1);

    if (settings.length === 0) {
      // Return default values if no settings exist
      return NextResponse.json({
        mode: 'auto',
        screenSize: 'desktop',
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff',
        primaryColor: '#3b82f6',
        cardPlaceholderColor: '#9ca3af',
        themePreset: 'default'
      });
    }

    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { 
      mode, 
      screenSize, 
      width, 
      height, 
      backgroundColor, 
      primaryColor,
      cardPlaceholderColor,
      themePreset
    } = requestBody;

    // Validate mode
    if (mode !== undefined && !['auto', 'manual'].includes(mode)) {
      return NextResponse.json({ 
        error: "Mode must be 'auto' or 'manual'",
        code: "INVALID_MODE" 
      }, { status: 400 });
    }

    // Validate screenSize
    if (screenSize !== undefined && !['mobile', 'tablet', 'desktop', 'tv'].includes(screenSize)) {
      return NextResponse.json({ 
        error: "Screen size must be 'mobile', 'tablet', 'desktop', or 'tv'",
        code: "INVALID_SCREEN_SIZE" 
      }, { status: 400 });
    }

    // Validate width
    if (width !== undefined && (!Number.isInteger(width) || width <= 0)) {
      return NextResponse.json({ 
        error: "Width must be a positive integer",
        code: "INVALID_WIDTH" 
      }, { status: 400 });
    }

    // Validate height
    if (height !== undefined && (!Number.isInteger(height) || height <= 0)) {
      return NextResponse.json({ 
        error: "Height must be a positive integer",
        code: "INVALID_HEIGHT" 
      }, { status: 400 });
    }

    // Validate hex colors
    const hexFields = ['backgroundColor', 'primaryColor', 'cardPlaceholderColor'];
    for (const field of hexFields) {
      const value = requestBody[field];
      if (value !== undefined) {
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
        if (!hexColorRegex.test(value)) {
          return NextResponse.json({ 
            error: `${field} must be a valid hex color format (#rrggbb)`,
            code: `INVALID_${field.toUpperCase().replace(/Color/, '_COLOR')}` 
          }, { status: 400 });
        }
      }
    }

    // Validate themePreset
    if (themePreset !== undefined && !['default', 'green', 'purple', 'red', 'orange'].includes(themePreset)) {
      return NextResponse.json({ 
        error: "Theme preset must be one of: default, green, purple, red, orange",
        code: "INVALID_THEME_PRESET" 
      }, { status: 400 });
    }

    // Check if settings already exist
    const existingSettings = await db.select()
      .from(appearanceSettings)
      .limit(1);

    const updatedAt = new Date().toISOString();

    if (existingSettings.length > 0) {
      // Update existing settings
      const updateData = { updatedAt };

      if (mode !== undefined) updateData.mode = mode;
      if (screenSize !== undefined) updateData.screenSize = screenSize;
      if (width !== undefined) updateData.width = width;
      if (height !== undefined) updateData.height = height;
      if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
      if (primaryColor !== undefined) updateData.primaryColor = primaryColor;
      if (cardPlaceholderColor !== undefined) updateData.cardPlaceholderColor = cardPlaceholderColor;
      if (themePreset !== undefined) updateData.themePreset = themePreset;

      const updated = await db.update(appearanceSettings)
        .set(updateData)
        .where(eq(appearanceSettings.id, existingSettings[0].id))
        .returning();

      return NextResponse.json(updated[0]);
    } else {
      // Create new settings with defaults for missing fields
      const insertData = {
        mode: mode || 'auto',
        screenSize: screenSize || 'desktop',
        width: width || 1200,
        height: height || 800,
        backgroundColor: backgroundColor || '#ffffff',
        primaryColor: primaryColor || '#3b82f6',
        cardPlaceholderColor: cardPlaceholderColor || '#9ca3af',
        themePreset: themePreset || 'default',
        updatedAt
      };

      const newSettings = await db.insert(appearanceSettings)
        .values(insertData)
        .returning();

      return NextResponse.json(newSettings[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}