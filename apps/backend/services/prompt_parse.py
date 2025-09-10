import re

def parse_prompt(prompt: str) -> dict:
    """
    Parse prompt to extract headline, subline, CTA, and colors
    """
    parsed = {
        'headline': '',
        'subline': '',
        'cta': '',
        'colors': {
            'fg': '#000000',
            'bg': '#FFFFFF',
            'accent': '#3B82F6'
        }
    }
    
    # Extract headline
    headline_match = re.search(r'headline:\s*([^.]*)', prompt, re.IGNORECASE)
    if headline_match:
        parsed['headline'] = headline_match.group(1).strip()
    
    # Extract CTA
    cta_match = re.search(r'cta:\s*([^.]*)', prompt, re.IGNORECASE)
    if cta_match:
        parsed['cta'] = cta_match.group(1).strip()
    
    # Extract subline (anything between headline and CTA)
    if parsed['headline'] and parsed['cta']:
        # Try to find subline between headline and CTA
        pattern = rf"{re.escape(parsed['headline'])}\s*[.,]\s*([^.]*?)\s*[.,]\s*{re.escape(parsed['cta'])}"
        subline_match = re.search(pattern, prompt, re.IGNORECASE)
        if subline_match:
            parsed['subline'] = subline_match.group(1).strip()
    
    # Extract colors from theme
    theme_match = re.search(r'theme:\s*([^.]*)', prompt, re.IGNORECASE)
    if theme_match:
        theme_text = theme_match.group(1).lower()
        colors = extract_colors_from_theme(theme_text)
        parsed['colors'].update(colors)
    
    # If no headline found, use first sentence as headline
    if not parsed['headline']:
        sentences = prompt.split('.')
        if sentences:
            parsed['headline'] = sentences[0].strip()
    
    return parsed

def extract_colors_from_theme(theme_text: str) -> dict:
    """Extract colors from theme text"""
    colors = {}
    
    # Color mappings
    color_map = {
        'teal': '#008080',
        'blue': '#3B82F6',
        'green': '#10B981',
        'red': '#EF4444',
        'orange': '#F97316',
        'purple': '#8B5CF6',
        'pink': '#EC4899',
        'yellow': '#F59E0B',
        'gold': '#F59E0B',
        'black': '#000000',
        'white': '#FFFFFF',
        'gray': '#6B7280',
        'grey': '#6B7280',
    }
    
    # Find colors in theme text
    for color_name, hex_color in color_map.items():
        if color_name in theme_text:
            if 'fg' not in colors:
                colors['fg'] = hex_color
            elif 'accent' not in colors:
                colors['accent'] = hex_color
            elif 'bg' not in colors:
                colors['bg'] = hex_color
    
    # Set defaults if not found
    if 'fg' not in colors:
        colors['fg'] = '#000000'
    if 'accent' not in colors:
        colors['accent'] = '#3B82F6'
    
    return colors
