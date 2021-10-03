# Streamplot of complex function

Online tool written in Svelte and Javascript for visualization of complex functions (defined from &#8450; to &#8450;) through their streamplot: &fnof;(x) dictates the instant velocity of the particle whose position is x (with x &isin; &#8450;).

The tool, published [here](https://federicoguglielmi.it/streamplot), allows a great deal of customisation:

* A function can be chosen amost many;
* Three complex numbers (**z<sub>1</sub> z<sub>2</sub> z<sub>3</sub>**) appearing in some function definition, can be inserted by the user;
* Others real number **r** and integer number **k** can be inserted too, and they will affect some functions behaviours;
* Small **dt** applied to &fnof;(x) to obtain instant velocity;
* Particle life;
* Number and magnifying factor of colors;
* The viewbox can be panned to move across the Guassian plane;
* Alt + scroll zooms in and out of the viewbox;

## TODO
* Manual input of visible range of x- and y-axis;
* Axis ratio lock;
* More functions;
* Maybe input and parsing of user-defined functions;