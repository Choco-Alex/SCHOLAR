
function classManager() {
  return {
    newClassName: "",
    classes: [],
    addClass() {
      if (this.newClassName.trim() !== "") {
        this.classes.push(this.newClassName.trim());
        this.newClassName = ""; // Réinitialiser l'input
      }
    },
    removeClass(index) {
      this.classes.splice(index, 1);
    },
    saveAll() {
      // Ici, tout est prêt pour être envoyé à votre backend (via fetch ou formulaire classique)
      console.log("Salles prêtes à être enregistrées :", this.classes);
      alert(this.classes.length + " salle(s) enregistrée(s) avec succès !");

      // Exemple d'envoi AJAX si besoin :
      // fetch('/api/salles', { method: 'POST', body: JSON.stringify(this.classes) })
    },
  };
}
