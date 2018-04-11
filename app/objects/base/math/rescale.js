/*
	WRITTEN BY: Joshua Avrick

	BASED ON: https://stats.stackexchange.com/questions/25894/changing-the-scale-of-a-variable-to-0-100

	USE: This function takes a value within a certain number range and returns that value AT THE SAME SCALE
	within a new range. For example given the value 7 within a range of 0-10 and given a new range of 0-100, 
	the return value will be 70. This is useful when dealing with unusual number ranges (like 1.2 to 4.6) as it
	allows you to work in a more easily vizualized range like 0 to 100.
*/

function rescale(value, oldMin, oldMax, newMin, newMax){
	return ((newMax - oldMin) / (oldMax - oldMin)) * (value - oldMax) + newMax;
}

export default rescale;