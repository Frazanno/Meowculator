<html>

	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<script src="codeday_script.js?<?php echo filemtime("codeday_script.js");?>"></script>
		<title>The Meowculator</title>
		<link rel="stylesheet" type="text/css" href="codeday_style.css?<?php echo filemtime("codeday_style.css");?>">
		<audio class="doodly" src="doodly.ogg"></audio>
		<audio class="meow" src="meow.ogg"></audio>
	</head>

	<body>
		<div class="info" style='text-align: center; width: 100%; color:#404040'>Welcome to the Meowculator, the best math tool on the Internet!</div>
		<div class="switch">
			Music
		</div>
		<div class="hits" style='text-align: center; width: 100%; color:#404040'></div>
	<br/>

		<div class = "calculator_outer">

	<div class="arrow-up"></div>
	<div class="arrow-up-2"></div>
	<div class="whisker-1"> </div>
	<div class="whisker-2"> </div>
	<div class="whisker-3"> </div>
	<div class="whisker-4"> </div>
	<div class="whisker-5"> </div>
	<div class="whisker-6"> </div>

			<div class = "output_wrapper_outer">
				
				<div class = "output_wrapper">
					
					<div class="output_wrapper_sub">
						
						<div class="output"></div>
						
						<div class = "secondary current"></div>

					</div>	

				</div>

			</div>
			
			<div class = "top_bar">

				<div class = "x-var">
					x
				</div>

				<div class = "e-num">
					e
				</div>

				<div class = "pi-num">
					&pi;
				</div>

				<div class = "exponential">
					x<sup>y</sup>
				</div>
						
				<div class = "nth-root">
					<sup>n</sup>&radic;x
				</div>	

				<div class = "log">
					log<sub>b</sub>x
				</div>
						
				<div class = "deriv">
					dy/dx
				</div>		

			</div>

			<div class = "keypad">

				<div class = "numbers">

					<div class = "firstr" style = "margin-top: -5px;">

						<div class = "seven">
							7
						</div>	
						
						<div class = "eight">
							8
						</div>
						
						<div class = "nine">
							9
						</div>

						<div class = "multiply" style = "line-height: 85px">
							X
						</div>	
						
					</div>

					<div class = "secondr">

						<div class = "four">
							4
						</div>
	
						<div class = "five">
							5
						</div>

						<div class = "six">
							6
						</div>
					
						<div class = "divide">
							/
						</div>	

					</div>

					<div class = "thirdr">

						<div class = "one">
							1
						</div>
					
						<div class = "two">
							2
						</div>
					
						<div class = "three">
							3
						</div>
										
						<div class = "add">
							+
						</div>

					</div>

					<div class = "fourthr">

						<div class = "zero">
							0
						</div>
					
						<div class = "point">
							.
						</div>
					
						<div class = "subtract">
							-
						</div>	

					</div>				

			<div class = "right_bar">

				<div class = "clear">
					clear
				</div>

				<div class = "l-paren">
					(
				</div>

				<div class = "r-paren">
					)
				</div>

				<div class = "submit">
					=
				</div>	

			</div>



				</div>

			</div>
		</div>
		<br/><br/><div style='text-align: center; width: 100%; color:#404040'>The Meowculator Copyright &copy; 2015 Samuel Heasley, Samuel Royall, and Amy Liu</div>
	</body>
</html>