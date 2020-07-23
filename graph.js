

"use strict";

let Data;
function getFile()
{

    var init = {
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
            mode:'cors',
            cache:'default'
        };
        let INR_request = new Request("./visual_INR.json",init);

    fetch(INR_request).then(function(resp){
        return resp.json();
    })
    .then(function(data){
        console.log(data);
        const entries = Object.entries(data);
        console.log("Entries");
        console.log(entries);
        var keys = []; //dates
        var values = []; //inr rates
        for(var k in data) keys.push(k);

        console.log(keys);

        for(var i=0;i<keys.length;i++)
            values.push(data[keys[i]]);
            
        console.log(values);

        //find min and max values
        var min=values[0];
        var max=values[0];

        for(let i=1;i<values.length;i++)
        {
            if(values[i] < min)
                min = values[i];
        }
        for(let i=1;i<values.length;i++)
        {
            if(values[i] > max)
                max = values[i];
        }

        min = min.toFixed(3);
        max = max.toFixed(3);
       // console.log("\n\nmin and max "+min+"\t"+max+"\n\n");
        const yAxis = 10;
        var yScale = (max-min)/yAxis; //0.226
        yScale= yScale.toFixed(3);

        console.log("\n\nmin and max "+min+"\t"+max+"\t"+yScale+"\n\n");



        let canvas = document.querySelector('canvas');
        canvas.width=1200;
        canvas.height=900;

        const size = 20;
        let horizontal=size;
        let vertical=size;


        let ctx= canvas.getContext('2d');

        
        function createGraph()
        {
            ctx.beginPath();

            while(horizontal<canvas.height)
            {
                ctx.moveTo(0,horizontal);
                ctx.lineTo(canvas.width,horizontal);
                horizontal += size;
            }

            while(vertical<canvas.width)
            {
                ctx.moveTo(vertical,0);
                ctx.lineTo(vertical,canvas.height);
                vertical += size;
            }
            ctx.strokeStyle = "lightblue";
            ctx.stroke();
            
        }

        function blocks(count)
        {
            return parseFloat(count*size);
        }
        function createAxis()
        {
            let yPlot=40;
        
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.moveTo(blocks(5),blocks(5));
            ctx.lineTo(blocks(5),blocks(40));
            ctx.lineTo(blocks(80),blocks(40)); 
            
            ctx.moveTo(blocks(5),blocks(40));
            
            // for(let i=0;i<values.length;i++)
            // {
            //     ctx.strokeText(values[i],blocks(2),blocks(yPlot))
            //     yPlot-=2;
            // }
            var temp = 0;
            for(let i=0; i<values.length;i++)
            {
                if(parseFloat(temp) > parseFloat(max+yScale))
                    break;
                ctx.strokeText(parseFloat(temp),blocks(2),blocks(yPlot))
                if(temp == 0)
                {
                    temp = parseFloat(min);
                    yPlot-=3;
                    continue;
                }
                yPlot-=3;
                temp =( parseFloat(temp)+parseFloat(yScale) ).toFixed(3); 
            }
            ctx.stroke();
            
        }
        function labels()
        {
            ctx.beginPath();
            ctx.strokeStyle="black";
            ctx.moveTo(blocks(20),blocks(42));
            ctx.strokeText("DATES",blocks(20),blocks(42));
            ctx.stroke();
        }
        function drawLine()
        {
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.moveTo(blocks(5),blocks(40));

            var xPlot = 7;
            //ctx.lineTo(blocks(xPlot),blocks(40-3));
            const gridUnit = 3.0;
            for(const [dates,rates] of entries)
            {
                var units = parseFloat((rates-min)/yScale).toFixed(3);

                console.log(37 -parseFloat(gridUnit*units));
                ctx.strokeStyle="blue"
                ctx.strokeText(dates,blocks(xPlot),blocks(37 - parseFloat(gridUnit*units)));
                ctx.strokeStyle="black";
                ctx.lineTo(blocks(xPlot),blocks(37 - gridUnit*units));
                xPlot+=2;
            }
            ctx.stroke();


        }
        createGraph();
        createAxis();
        labels();
        drawLine();

        });
        }
            
getFile();


