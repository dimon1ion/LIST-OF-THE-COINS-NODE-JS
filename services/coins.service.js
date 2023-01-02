
class CoinsService {

    static connection;

    static async initConnection(newConnection){
        CoinsService.connection = newConnection;
    }

    static async getCategories(){
        const [categories] = await CoinsService.connection.query(`SELECT Id, Name, Image FROM Categories`);
        return categories;
    }

    static async getCountries(){
        const [countries] = await CoinsService.connection.query(`SELECT Name as name FROM Countries`);
        return countries;
    }

    static async getCompositions(){
        const [compositions] = await CoinsService.connection.query(`SELECT Name as name FROM Compositions`);
        return compositions;
    }

    static async getQualities(){
        const [qualities] = await CoinsService.connection.query(`SELECT Name as name FROM Qualities`);
        return qualities;
    }

    static async getCoinById(id){
        const [coin] = await CoinsService.connection.query(`
            SELECT coins.id, coins.name, coins.short_Info, coins.full_Info,
                countries.name as country, categories.id as categoryId,
                compositions.name as composition, qualities.name as quality,
                coins.denomination, coins.year, coins.weight, coins.price,
                coins.reverse_Image, coins.obverse_Image
            FROM coins, countries, compositions, qualities, coins.categories
            WHERE coins.id = ${id} AND coins.categorieId = categories.id AND coins.countrieId = countries.id AND coins.compositionId = compositions.id AND coins.qualityId = qualities.id
            LIMIT 1;`);
        return coin;
    }

    static async getCoinsByCategoryId(categoryId, limit, offset){
        const query = `SELECT id, name, short_Info, obverse_Image FROM Coins WHERE categorieId=${categoryId}`;
        const [coins] = await CoinsService.connection.query(`${query} LIMIT ${+limit} OFFSET ${+offset}`);
        const count = await this.getCountResult(query);
        return {coins, count};
    }

    static async getCoins(mainValue, country, composition, quality, priceFrom, priceTo, yearFrom, yearTo, limit, offset){
        const query = `
            SELECT coins.id, coins.name, coins.short_Info, coins.obverse_Image
            FROM (SELECT * FROM coins
                    WHERE coins.name LIKE '%${mainValue}%'
                    union
                    SELECT * FROM coins
                    WHERE coins.short_Info LIKE '%${mainValue}%'
                    union
                    SELECT * FROM coins
                    WHERE coins.full_Info LIKE '%${mainValue}%') as coins,
                coins.countries, coins.compositions, coins.qualities
            WHERE countries.name LIKE '%${country}%' AND compositions.name LIKE '%${composition}%' AND qualities.name LIKE '%${quality}%' AND 
                ${+priceFrom >= 0 && priceFrom !== "" ? `${+priceFrom} <= coins.price AND` : ``} ${+priceTo >= 0 && priceTo !== "" ? `coins.price <= ${+priceTo} AND` : ``} 
                ${+yearFrom >= 0 && yearFrom !== "" ? `${+yearFrom} <= coins.year AND` : ``} ${+yearTo >= 0 && yearTo !== "" ? `coins.year <= ${+yearTo} AND` : ``} 
                coins.countrieId = countries.id AND coins.compositionId = compositions.id AND coins.qualityId = qualities.id`
        const [coins] = await CoinsService.connection.query(`${query} LIMIT ${limit} OFFSET ${offset}`);
        const count = await this.getCountResult(query);
        return {coins, count};
    }
    
    static async getCountResult(query){
        const [[{count}]] = await CoinsService.connection.query(`
            SELECT COUNT(query.id) as count FROM (${query}) as query`);
        return count;
    }

}

module.exports = CoinsService;