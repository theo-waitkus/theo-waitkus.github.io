var glutamate = 0;
var num_NMDA = 1;
var num_AMPA = 1;
var mg=1;
var apv = 0;
var potential = 70;
var pos = 0;
var mg_go = 1;
var id;
var cnqx = 0;
var coordss=[];
var receptor_offset_x = -10;
var receptor_offset_y = -50;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var chill = 0;
ctx.font = "30px Arial";

function resett()
{
	clearInterval(id);
	chill = 0;
	glutamate = 0;
	num_NMDA = 1;
	num_AMPA = 1;
	mg=1;
	apv = 0;
	potential = 70;
	pos = 0;
	mg_go = 1;
	cnqx=0
	reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
}

function change_glutamate(x)
{
	clearInterval(id);
	glutamate = x;
	if(glutamate == 1)
	{
		coordss = [];
		coordss.push([600,200,"Glutamate"]);
		reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
		flow(coordss)
	}

	else if (glutamate == 0)
	{
		pos = 400;
		potential = 70;
		mg=1;
		chill = 0;
		reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
	}
	reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
}

function change_apv(x)
{
	clearInterval(id);
	apv = x;
	if(mg == 0 && apv == 0 && glutamate == 1)
	{
		var coordss = [[515,400,"Calcium"]];
		flow(coordss);
	}
	reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
}

function change_cnqx(x)
{
	clearInterval(id);
	cnqx = x;
	if(cnqx == 0 && glutamate == 1 && potential == 70)
	{
		coordss = [];
		for(var i = 0; i < num_AMPA ; i++)
		{
			coordss.push([715+200*i,400,"Sodium"]);
			coordss.push([715+200*i,600,"Potassium"]);
		}
		reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
		flow(coordss)
	}
	reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
}

function change_polarization(x)
{
	clearInterval(id);
	potential = x;
	if (potential == 20 && mg == 1)
	{
		mg = 0;
		if(apv == 0 && glutamate == 1)
		{
			var coordss = [[515,400,"Calcium"]];
			flow(coordss);
		}
	}
	if (potential == 70)
	{
		mg = 1;
	}
	reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
}

function draw_cell(y)
{
	ctx.beginPath();
	ctx.moveTo(0, y);
	ctx.lineTo(1700, y);
	ctx.stroke();
}

function draw_potential(x,y,value)
{
	ctx.fillStyle = "#000000";
	ctx.fillText("-"+value+"mV", x-61, y+10);
}

function draw_NMDA(x,y,mg,apv,glut)
{
	var offset;
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(x, y-50, 30, 100);
	ctx.fillStyle = "#FF0000";
	ctx.beginPath();
	ctx.ellipse(x, y, 50, 30, Math.PI/2, 0, Math.PI);
	ctx.fill();
	if(mg == 1 || apv == 1 || glutamate == 0 || chill == 0)
	{
		offset = 0;
	}
	else
	{
		offset = 1;
	}
	ctx.beginPath();
	ctx.ellipse(x+(30*offset), y, 50, 30, Math.PI*3/2, 0, Math.PI);
	ctx.fill();
	ctx.fillText("NMDA", x-25, y+100);
}

function draw_AMPA(x,y,mg,cnqx,glut)
{
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(x, y-50, 30, 100);
	ctx.fillStyle = "#0000FF";
	ctx.beginPath();
	ctx.ellipse(x, y, 50, 30, Math.PI/2, 0, Math.PI);
	ctx.fill();
	ctx.beginPath();
	if(cnqx == 0 && chill == 1)
	{
		ctx.ellipse(x+(30*(glut)), y, 50, 30, Math.PI*3/2, 0, Math.PI);
	}
	else
	{
		ctx.ellipse(x, y, 50, 30, Math.PI*3/2, 0, Math.PI);
	}
	ctx.fill();
	ctx.fillText("AMPA", x-25, y+100);
}

function draw_Mg(x,y)
{
	ctx.fillStyle = "#808080";
	ctx.beginPath();
	ctx.arc(x-20, y-40, 9, 0, 2 * Math.PI,true);
	ctx.fill();
	ctx.fillText("Mg", x-80, y-40);
}

function draw_glut(x,y)
{
	ctx.fillStyle = "#ffb412";
	ctx.beginPath();
	ctx.arc(x-20, y-40, 9, 0, 2 * Math.PI,true);
	ctx.fill();
	ctx.fillText("Glutamate", x-80, y-70);
}

function draw_apv(x,y)
{
	ctx.fillStyle = "#f8fc03";
	ctx.beginPath();
	ctx.arc(x-20, y-40, 9, 0, 2 * Math.PI,true);
	ctx.fill();
	ctx.fillText("APV", x-75, y-50);
}

function draw_cnqx(x,y)
{
	ctx.fillStyle = "#c603fc";
	ctx.beginPath();
	ctx.arc(x-20, y-40, 9, 0, 2 * Math.PI,true);
	ctx.fill();
	ctx.fillText("CNQX", x-75, y-50);
}


function reset(NMDA,AMPA,MG,APV,CNQX,GLUTAMATE,POTENTIAL)
{
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, 1700, 900);
	draw_cell(500);
	draw_cell(200);
	ctx.fillStyle = "#000000";
	ctx.fillText("Postsynaptic Neuron", 500, 700);
	ctx.fillText("Presynaptic Neuron", 500, 100);
	draw_NMDA(500,500,MG,APV,GLUTAMATE);
	if(GLUTAMATE == 1 && chill == 1)
	{
		draw_glut(600,400);
	}
	if(APV==1)
	{
		draw_apv(500,500);
	}
	else if (MG == 1)
	{
		draw_Mg(500,500);
	}
	else if (GLUTAMATE == 1 && chill == 1)
	{
		draw_glut(500,500);
	}
	for(var i=0; i<AMPA; i++)
	{
		draw_AMPA(700+(i*200),500,MG,CNQX,GLUTAMATE);
		if(GLUTAMATE==1 && CNQX == 0 && chill == 1)
		{
			draw_glut(700+(i*200),500);
		}
		else if (CNQX == 1)
		{
			draw_cnqx(700+(i*200),500);
		}
	}
	draw_potential(400,550,POTENTIAL);
}

function render()
{
	reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
}

function calcium(x,y)
{
	ctx.fillStyle = "#bd3dbf";
	ctx.beginPath();
	ctx.arc(x, y, 9, 0, 2 * Math.PI,true);
	ctx.fill();
	ctx.fillText("Calcium", x-80, y-40);
}

function sodium(x,y)
{
	ctx.fillStyle = "#5beb34";
	ctx.beginPath();
	ctx.arc(x, y, 9, 0, 2 * Math.PI,true);
	ctx.fill();
	ctx.fillText("Sodium", x-80, y-40);
}

function potassium(x,y)
{
	ctx.fillStyle = "#34e5eb";
	ctx.beginPath();
	ctx.arc(x, y, 9, 0, 2 * Math.PI,true);
	ctx.fill();
	ctx.fillText("Potassium", x-80, y-40);
}

function flow(coords)
{
  id = null;
  var iterations = 1000;
  pos=0;
  clearInterval(id);
  id = setInterval(frame, 10);
  function frame() {
	var type = coords[0][2];
    if (pos == 400) 
	{
      clearInterval(id);
	  if(type=="Glutamate")
	  {
		chill = 1;
		if(cnqx == 0 && mg == 1)
		{
			coordss = [];
			console.log("glut end");
			for(var i = 0; i < num_AMPA ; i++)
			{
				coordss.push([715+200*i,400,"Sodium"]);
				coordss.push([715+200*i,600,"Potassium"]);
			}
			reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
			flow(coordss)
		}
	  }
	  else if(mg==1)
	  {
		  potential = 20;
		  mg = 0;
		  if(apv == 0)
		  {
			var coordss = [[515,400,"Calcium"]];
			flow(coordss);
		  }
		  reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
	  }
	  else if(type=="Calcium")
	  {
		  num_AMPA+=1; 
		  reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
	  }
	  else
	  {
		reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);  
	  }
    } 
	else 
	{
      pos++; 
	  reset(num_NMDA,num_AMPA,mg,apv,cnqx,glutamate,potential);
	  for(var i = 0; i<coords.length; i++)
	  {
		  type = coords[i][2];
		  if(type=="Calcium")
		  {
			  calcium(coords[i][0],coords[i][1]);
			  coords[i][1]+=1/2;
		  }
		  if(type=="Sodium")
		  {
			  sodium(coords[i][0],coords[i][1]);
			  coords[i][1]+=1/2;
		  }
		  if(type=="Potassium")
		  {
			  potassium(coords[i][0],coords[i][1]);
			  coords[i][1]-=1/2;
		  }
		  if(type=="Glutamate")
		  {
			  draw_glut(coords[i][0],coords[i][1]);
			  coords[i][1]+=1/2;
		  }
	  }
    }
  }
}
render();
