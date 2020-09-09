class TeamRanking{    

    static generator(Games){

        const Ranking = Games.map(item => {
            
            let obj
            let game = ''
            let goals = 0
            let goalsAdv = 0
            let objAdv = undefined
            let objAdvDrew = undefined
            let result = []
            for(const x in Games){
                //console.log(Games[x].Time)
                if(item._id !== Games[x]._id){
                   
                    if(item.drew > 0){
                        item.drew --;
                        game = `${item.Time} drew with ${Games[x].Time}`
                        goals = 1
                        goalsAdv = 1
                        item.victories += 1

                        objAdvDrew = {
                            'Name': Games[x].Time,
                            'goalsAdv' : 1
                        }

                    }else if(Games[x].Defeat > 0){
                        Games[x].Defeat --
                        game = `${item.Time} beat ${Games[x].Time}`
                        goals = parseInt(Math.random() * (5 - 3) + 3)
                        goalsAdv = parseInt(Math.random() * (2 - 1) + 1)
                       
                        item.victories += 3
                        item.balanceGoals +=  goals - goalsAdv  

                        if(objAdv){
                            if(objAdv.Name == item.Time){
                                item.balanceGoals += objAdv.balanceGoals
                                item.victories += objAdv.victories

                                objAdv = undefined;
                            }
                        }

                        if(objAdvDrew){
                            if(objAdv.Name == item.Time){
                                item.balanceGoals += objAdv.balanceGoals
                                item.victories += objAdv.victories

                                objAdv = undefined;
                            }
                        }

                    }else{
                        game = `${Games[x].Time} beat ${item.Time} `
                        goalsAdv = parseInt(Math.random() * (5 - 3) + 3)
                        goals = parseInt(Math.random() * (2 - 1) + 1)
                        const toTal = (goalsAdv - goals)
                        objAdv = {

                            'Time':item.Time,
                            'balanceGoals' : toTal ,
                            'victories' : goals * 3
                        }
                        
                    }
                    
                    obj={

                        time: item.Time,
                        goals,
                        adv: Games[x].Time,
                        goalsAdv,
                        ResultGame: game,
                        Victories: item.victories,
                        BalanceGoals: item.balanceGoals,
                        scoreAdjustment : {

                            DrewAdv : objAdvDrew  ?  objAdvDrew : undefined,
                            ScoreAdv: objAdv ? objAdv : undefined
                        }
                    }
                    objAdv = undefined
                    objAdvDrew = undefined
                    result.push(obj)
                }
            }

            return result
        })
        
        return Ranking

    }

    static TrateResult(itens){

        let score = []
        let scoreDrew = []
        let Time = []
        for(const index in itens){

            for(const x in itens[index]){
               
                if(itens[index][x].scoreAdjustment.DrewAdv){
                    scoreDrew.push(itens[index][x].scoreAdjustment.DrewAdv.Name, itens[index][x].scoreAdjustment.DrewAdv.goalsAdv)
                   
                }
                if(itens[index][x].scoreAdjustment.ScoreAdv){

                    score.push(itens[index][x].scoreAdjustment.ScoreAdv.Time, 
                            itens[index][x].scoreAdjustment.ScoreAdv.balanceGoals, 
                            itens[index][x].scoreAdjustment.ScoreAdv.victories)
                }
                
                
                Time.push(itens[index][x].time, itens[index][x].Victories, itens[index][x].BalanceGoals)
                
            }
        }
        
        const scoreF = score.filter( dado => dado !== undefined )
        
        const Filter = function(Dado){
           
            let qtdTime = 0
           
            for(const index in Dado){
                if(Dado.length % index == 0){
                    qtdTime = index
                }
                else if(qtdTime){
                    return qtdTime
                }
            }
        
        }
        const filterObj = function(array, total){
            const baseCalculation = (total -1)
            const matches = array.length / (total -1)
            let result = []
            for(let index = (baseCalculation * 2) ; index <= array.length ; index += ( baseCalculation * baseCalculation )){
               
                result.push(array[index])
                index ++
                result.push(array[index])
                index ++
                result.push(array[index])
                index -= 2
            }
            
            return result
        }
        
        const readjustmentOfPoints = (ResultChampionship, Times)=>{
           
            let objRanking = {}
            let cont = 0
            let time
            
            for(const index in ResultChampionship){
                for(const x in ResultChampionship[index]){
                    
                    console.log('HERE==>', ResultChampionship[index][x].time)
                }
            }
        }

        const totalTeams = Filter(Time)
      
        const ScoreTime = filterObj(Time, totalTeams)
       
        readjustmentOfPoints(itens, ScoreTime)

        //console.log(ScoreTime)
        
       
    }
}
module.exports = TeamRanking