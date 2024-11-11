import re
import json

def fix_json_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove any leading/trailing whitespace
    content = content.strip()

    # Remove trailing commas before closing braces/brackets
    content = re.sub(r',\s*(\]|\})', r'\1', content)

    # Remove any extra commas at the end of the content
    content = re.sub(r',\s*$', '', content)

    # Wrap content in square brackets if not already
    if not content.startswith('['):
        content = '[' + content
    if not content.endswith(']'):
        content = content + ']'

    # Try to parse the JSON
    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        return

    # Write the fixed JSON to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    print(f"Fixed JSON has been written to {output_file}")

if __name__ == "__main__":
    input_file = 'nooki.json'
    output_file = 'nooki_fixed.json'

    fix_json_file(input_file, output_file)
