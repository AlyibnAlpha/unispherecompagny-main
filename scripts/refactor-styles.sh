#!/bin/bash

# Script pour extraire les styles des composants Vue et les déplacer vers des fichiers SCSS dédiés
# Usage: ./refactor-styles.sh <component.vue> <output.scss> <scss-imports>

set -e

COMPONENT_FILE=$1
OUTPUT_SCSS=$2
SCSS_IMPORTS=$3

if [ -z "$COMPONENT_FILE" ] || [ -z "$OUTPUT_SCSS" ]; then
    echo "Usage: $0 <component.vue> <output.scss> [scss-imports]"
    echo "Example: $0 AdLogsRc.vue activity-logs.scss 'tables-shared,badges'"
    exit 1
fi

# Vérifier que le composant existe
if [ ! -f "$COMPONENT_FILE" ]; then
    echo "❌ Erreur: Le fichier $COMPONENT_FILE n'existe pas"
    exit 1
fi

# Trouver la ligne où commence <style>
STYLE_START=$(grep -n "^<style" "$COMPONENT_FILE" | cut -d: -f1)

if [ -z "$STYLE_START" ]; then
    echo "⚠️  Aucun style trouvé dans $COMPONENT_FILE"
    exit 0
fi

# Trouver la ligne où se termine </style>
STYLE_END=$(grep -n "^</style>" "$COMPONENT_FILE" | cut -d: -f1)

if [ -z "$STYLE_END" ]; then
    echo "❌ Erreur: Balise </style> non trouvée dans $COMPONENT_FILE"
    exit 1
fi

# Calculer le nombre total de lignes
TOTAL_LINES=$(wc -l < "$COMPONENT_FILE")

echo "📄 Traitement de $COMPONENT_FILE"
echo "   Styles: lignes $STYLE_START à $STYLE_END"

# Extraire les styles (sans les balises <style> et </style>)
STYLE_CONTENT_START=$((STYLE_START + 1))
STYLE_CONTENT_END=$((STYLE_END - 1))

# Créer le fichier SCSS de destination s'il n'existe pas
SCSS_DIR="src/css/admin"
SCSS_PATH="$SCSS_DIR/$OUTPUT_SCSS"

if [ ! -f "$SCSS_PATH" ]; then
    echo "📝 Création de $SCSS_PATH"
    mkdir -p "$SCSS_DIR"
    cat > "$SCSS_PATH" << EOF
/**
 * Styles extraits de $COMPONENT_FILE
 */
@import './variables';

EOF
fi

# Ajouter un commentaire de séparation
echo "" >> "$SCSS_PATH"
echo "/* === Styles de $(basename $COMPONENT_FILE) === */" >> "$SCSS_PATH"

# Extraire et ajouter les styles
sed -n "${STYLE_CONTENT_START},${STYLE_CONTENT_END}p" "$COMPONENT_FILE" >> "$SCSS_PATH"

echo "✅ Styles extraits vers $SCSS_PATH"

# Créer le nouveau fichier Vue avec les imports
TEMP_FILE=$(mktemp)
head -$((STYLE_START - 1)) "$COMPONENT_FILE" > "$TEMP_FILE"

# Ajouter les imports
cat >> "$TEMP_FILE" << EOF
<style lang="scss">
@import '../../../css/admin/$OUTPUT_SCSS';
EOF

# Ajouter les imports supplémentaires si spécifiés
if [ -n "$SCSS_IMPORTS" ]; then
    IFS=',' read -ra IMPORTS <<< "$SCSS_IMPORTS"
    for import in "${IMPORTS[@]}"; do
        echo "@import '../../../css/admin/${import}.scss';" >> "$TEMP_FILE"
    done
fi

cat >> "$TEMP_FILE" << EOF

// ✅ Tous les styles sont maintenant dans $OUTPUT_SCSS
</style>

EOF

# Remplacer le fichier original
mv "$TEMP_FILE" "$COMPONENT_FILE"

echo "✅ $COMPONENT_FILE mis à jour avec les imports"
echo ""
