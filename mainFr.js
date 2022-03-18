
const SHA256 = require('crypto-js/sha256')

class Bloc {
    constructor(index, horodatage, données, hachagePrécédent = '') {
        this.index = index;
        this.horodatage = horodatage;
        this.données = données;
        this.hachagePrécédent = hachagePrécédent;
        this.hachage = this.calculerHachage();
        this.nonce = 0;
    }

    calculerHachage() {
        return SHA256(
            this.index + 
            this.hachagePrécédent +
            this.horodatage + 
            JSON.stringify(this.données) + 
            this.nonce).toString();
    }

    minerBloc(difficulté) {
        while(this.hachage.substring(0, difficulté) !== Array(difficulté + 1).join("0")){
            this.nonce++;
            this.hachage = this.calculerHachage();
        }

        console.log("BLOC NO." + this.index + " : " + this.hachage)
    }

}

class Blockchain {
    constructor() {
        this.chaîne = [this.créerPremierBloc()];
        this.difficulté = 5;
    }

    créerPremierBloc() {
        return new Bloc(0, "03/01/2009", "Premier bloc", "0");
    }

    obtenirDernierBloc(){
        return this.chaîne[this.chaîne.length - 1];
    }

    ajouterBloc(nouveauBloc){
        nouveauBloc.hachagePrécédent = this.obtenirDernierBloc().hachage;
        nouveauBloc.minerBloc(this.difficulté);
        this.chaîne.push(nouveauBloc);
    }

    chaîneEstValide() {
        for (let i = 1; i < this.chaîne.length; i++) {
            const blocActuel = this.chaîne[i];
            const blocPrécédent = this.chaîne[i - 1];

            if (blocActuel.hachage !== blocActuel.calculerHachage()) {
                return false;
            }

            if (blocActuel.hachagePrécédent !== blocPrécédent.hachage) {
                return false;
            }
        }

        return true;
    }

} 

let blockchainEphec = new Blockchain();

console.log('Minage du 1er bloc...')
blockchainEphec.ajouterBloc(new Bloc(1, "10/07/2017", { montant: 4 }));
console.log("Est-ce que la blockchain est valide? " + blockchainEphec.chaîneEstValide());

console.log('Minage du 2e bloc...')
blockchainEphec.ajouterBloc(new Bloc(2, "12/07/2017", { montant: 10 }));
console.log("Est-ce que la blockchain est valide? " + blockchainEphec.chaîneEstValide());
