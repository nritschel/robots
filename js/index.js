// Injects Blockly into the html page and adds event handlers.

var toolbox = document.getElementById("toolbox");
var leftWorkspace = Blockly.inject('leftdiv',
  { media: 'blockly/media/',
    toolbox: toolboxLeft,
    trashcan: true,
    toolboxPosition: "start",
    move:{
      scrollbars: false,
      drag: false,
      wheel: false}
});

var workspaceBlocks = document.getElementById("workspaceBlocks");
Blockly.Xml.domToWorkspace(workspaceBlocks, leftWorkspace);
leftWorkspace.getAllBlocks().forEach(block => { block.setMovable(false); block.setDeletable(false); block.setEditable(false) });

leftWorkspace.registerToolboxCategoryCallback(
  'TASKS', flyoutCategory);

var currentRightDiv = null;

function onTaskSelected(event) {
  if (event.type == Blockly.Events.UI && event.element == 'selected') {
    var selectedBlock = leftWorkspace.getBlockById(event.newValue);
    if (selectedBlock && selectedBlock.type == 'custom_task') {
      if (currentRightDiv) {
        currentRightDiv.style.display = 'none';
      }
      var taskName = selectedBlock.getFieldValue("TASK");
      if (document.getElementById("__" + taskName + "div")) {
        currentRightDiv = document.getElementById("__" + taskName + "div");
        currentRightDiv.style.display = 'block';
      }
      else {
        currentRightDiv = document.createElement('div');
        currentRightDiv.id = "__" + taskName + "div";
        currentRightDiv.classList.add('workspace');
        document.getElementById('rightdiv').appendChild(currentRightDiv);
        var rightWorkspace = Blockly.inject("__" + taskName + "div",
          { media: 'blockly/media/',
            toolbox: toolboxRight,
            trashcan: true,
            move:{
              scrollbars: false,
              drag: false,
              wheel: false}
        });
        var block = Blockly.utils.xml.createElement('block');
        block.setAttribute('type', 'custom_taskheader');
        block.setAttribute('x', '38');
        block.setAttribute('y', '38');
        var field = Blockly.utils.xml.createElement('field');
        field.setAttribute('name', 'TASK');
        field.setAttribute('id', selectedBlock.getFieldValue("TASK"));
        var name = Blockly.utils.xml.createTextNode(selectedBlock.getFieldValue("TASK"));
        field.appendChild(name);
        block.appendChild(field);
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml">' + Blockly.Xml.domToText(block) + '</xml>'), rightWorkspace);
        rightWorkspace.getAllBlocks().forEach(block => { block.setMovable(false); block.setDeletable(false); block.setEditable(false) });
      }
    }
  } 
}

leftWorkspace.addChangeListener(onTaskSelected);