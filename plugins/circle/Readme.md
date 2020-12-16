# CircleModel
This is an example about how to define a plugin in VariaMos.
This model only contains a CircleElement (with a circle figure) that can be placed in the model area.

# Installation
- Copy and paste this folder: plugins/circle/custom_models/circle/* - in the next destination: src/assets/js/custom_models/circle/*. 
- Run VariaMos, open VariaMos in the browser, and go to the config section. Click the button "Discover installed models".
- Now the circle model should appear in the list.
- Go to the projects section, and create a new project with the CircleModel.
- Verify that the model allows you to create circles.
- Congratulations, plugin installed.

# Optional
- You can include the Circle model integration test file in the integration test folder.
- Copy and paste this file: plugins/circle/tests/integration/circle_model_spec.ts - in the next destination: cypress/integration/circle_model_spec.ts. 

# Uninstall
- Remove the src/assets/js/custom_models/circle/ folder.
- Remove the cypress/integration/circle_model_spec.ts file (if it applies). 

# Autor
- Daniel Correa (dcorreab@eafit.edu.co)

# Info
- Version: 1.0.1