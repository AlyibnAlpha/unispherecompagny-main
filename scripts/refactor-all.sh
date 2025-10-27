#!/bin/bash

# Script pour refactoriser tous les composants selon la structure du menu
# Ce script organise les styles par fonctionnalité

set -e

cd "$(dirname "$0")/.."
SCRIPT_DIR="$(pwd)/scripts"
COMPONENTS_DIR="src/components/admin/enquete"

echo "🚀 Début de la refactorisation des styles"
echo "=========================================="
echo ""

# Fonction pour traiter un composant
refactor_component() {
    local component=$1
    local scss_file=$2
    local imports=$3
    
    if [ -f "$COMPONENTS_DIR/$component" ]; then
        echo "📦 Traitement de $component..."
        "$SCRIPT_DIR/refactor-styles.sh" "$COMPONENTS_DIR/$component" "$scss_file" "$imports"
    else
        echo "⚠️  $component non trouvé, ignoré"
    fi
}

# === Gamification ===
echo "🎮 Gamification"
echo "---------------"
refactor_component "AdCataCom.vue" "gamification.scss" "tables-shared,badges"
refactor_component "AdGestEchReCom.vue" "gamification.scss" "tables-shared,badges"
refactor_component "AdLeaderCom.vue" "gamification.scss" "tables-shared,badges"
refactor_component "AdTranscCom.vue" "gamification.scss" "tables-shared,badges"

# === Journaux d'activités ===
echo "📋 Journaux d'activités"
echo "------------------------"
refactor_component "AdLogsRc.vue" "activity-logs.scss" "tables-shared,badges"
refactor_component "AdLogs.vue" "activity-logs.scss" "tables-shared,badges"
refactor_component "AdLogsUc.vue" "activity-logs.scss" "tables-shared,badges"

# === Rapports ===
echo "📊 Rapports"
echo "-----------"
refactor_component "AdddRapport.vue" "reports.scss" "tables-shared,badges"

# === Autres composants ===
echo "📦 Autres composants"
echo "--------------------"
refactor_component "PratCataCom.vue" "gamification.scss" "tables-shared,badges"
refactor_component "PratTransCom.vue" "gamification.scss" "tables-shared,badges"
refactor_component "TaskListCom.vue" "tasks.scss" "tables-shared,badges"

echo ""
echo "=========================================="
echo "✅ Refactorisation terminée !"
echo ""
echo "📊 Résumé :"
echo "  - Fichiers SCSS créés/mis à jour dans src/css/admin/"
echo "  - Composants Vue nettoyés dans src/components/admin/enquete/"
echo ""
echo "📝 Voir REFACTORING_PROGRESS.md pour plus de détails"
