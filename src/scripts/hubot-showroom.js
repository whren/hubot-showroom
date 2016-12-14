/**
 * Description:
 *  List ec2 instances info
 *  Show detail about an instance if specified an instance id
 *  Filter ec2 instances info if specified an instance name
 *
 * Commands:
 *  hubot ec2 ls - Displays Instances
 *
 * Notes:
 *  --instance_id=***     : [optional] The id of an instance. If omit it, returns info about all instances.
 *  --instance_filter=*** : [optional] The name to be used for filtering return values by an instance name.
 */
var cmd_char = process.env.HUBOT_COMMAND_CHAR || "\!";
var base_id = "hubot-showroom.showroom-";
var command_name = "sr";
var robot;
var get_arg_params;

var actions = {
  video: {
    name: "video",
    regexp: "( \-\-[^ ]+)*( [^\-].+)?$",
//
// Use function to allow use of this.properties
//
//    help: function() {
//      return this.name + " [options] <parent_project_name> <project_name_to_generate>";
//    },
    help: "[options] <video>",
    arg_params: "msg.match[1]",
    required_params: [
      "msg.match[2]"
    ],
    request_message: "\"Requesting showroom video '\" + msg.match[2].trim() + \"'...\"",
    process: function(robot, action, msg) {
      for (var i =0; i < action.required_params.length; i++) {
        var required_param = action.required_params[i];
        
        if (!eval(required_param)) {
          msg.send(show_help(action) + "\n[options] can be :\n--output : use verbose output");
          return;
        }
      }

      msg.send(eval(action.request_message));

      var arg_params = get_arg_params(eval(action.arg_params));
      var video;

      switch (msg.match[2].trim().toUpperCase()) {
        case "VAGUE":
          video = "http://res.cloudinary.com/ntdc-showroom/video/upload/b_rgb:fff,c_pad,g_center,h_1080,w_1920/v1475050474/ACC-LIQUIDSTUDIOS03-1920_yfbkp8.mp4";
          break;
        case "SPLASH":
          video = "http://res.cloudinary.com/ntdc-showroom/video/upload/c_scale,h_1080,w_1920/v1475050475/Liquid-Application-Splash_Stg3_DS_jwntru.mp4";
          break;
        case "LS":
          video = "http://res.cloudinary.com/ntdc-showroom/video/upload/v1475059211/11979_006_30_sec_Liquid_Application_Studio_Overview_V5_wlq1lg.mp4";
          break;
        case "ALEXA":
          video = "http://res.cloudinary.com/ntdc-showroom/video/upload/v1481720753/Analyst.AI_-_Google_Chrome_13_12_2016_18_52_52_qzrrrl.mp4";
          break;
        default:
          video = msg.match[2].trim();
      }

      robot.emit('mqtt:pub', msg, process.env.HUBOT_SHOWROOM_PUBLISH_TOPIC_VIDEO, JSON.stringify({video:video}));
      //robot.emit('mqtt:pub', msg, "ls/rpi/demo/flow/via-internal-command/set", JSON.stringify({via:{video:video}}));
    }
  },
  collab: {
    name: "collab",
    regexp: "( \-\-[^ ]+)*( [^\-].+)?$",
    help: "[options] <via|visio>",
    arg_params: "msg.match[1]",
    required_params: [
      "msg.match[2]"
    ],
    request_message: "\"Requesting showroom preset '\" + msg.match[2].trim() + \"'...\"",
    process: function(robot, action, msg) {
      for (var i =0; i < action.required_params.length; i++) {
        var required_param = action.required_params[i];
        
        if (!eval(required_param)) {
          msg.send(show_help(action) + "\n[options] can be :\n--output : use verbose output");
          return;
        }
      }

      msg.send(eval(action.request_message));

      var arg_params = get_arg_params(eval(action.arg_params));
      var preset;

      switch (msg.match[2].trim().toUpperCase()) {
        case "VIA":
          preset = 1;
          break;
        case "VISIO":
          preset = 2;
          break;
        default:
      }

      robot.emit('mqtt:pub', msg, process.env.HUBOT_SHOWROOM_PUBLISH_TOPIC_HDMI, JSON.stringify({hdmi:{command:{preset:preset}}}));
    }
  },
  tv: {
    name: "tv",
    regexp: "( \-\-[^ ]+)*( [^\- ]+)?( [^\-].+)?$",
    help: "[options] <1|2|gauche|droite> <on|off>",
    arg_params: "msg.match[1]",
    required_params: [
      "msg.match[2]",
      "msg.match[3]"
    ],
    request_message: "\"Setting showroom tv '\" + msg.match[2].trim() + \"' '\" + msg.match[3].trim() + \"'...\"",
    process: function(robot, action, msg) {
      for (var i =0; i < action.required_params.length; i++) {
        var required_param = action.required_params[i];
        
        if (!eval(required_param)) {
          msg.send(show_help(action) + "\n[options] can be :\n--output : use verbose output");
          return;
        }
      }

      msg.send(eval(action.request_message));

      var arg_params = get_arg_params(eval(action.arg_params));
      var tv1 = false, tv2 = false;

      switch (msg.match[2].trim().toUpperCase()) {
        case "1":
        case "GAUCHE":
          tv1 = true;
          break;
        case "2":
        case "DROITE":
          tv2 = true;
          break;
        default:
      }

      if (tv1) {
        robot.emit('mqtt:pub', msg, process.env.HUBOT_SHOWROOM_PUBLISH_TOPIC_TV, JSON.stringify({tv:{number: 1, state: msg.match[3].trim()}}));
      }

      if (tv2) {
        robot.emit('mqtt:pub', msg, process.env.HUBOT_SHOWROOM_PUBLISH_TOPIC_TV, JSON.stringify({tv:{number: 2, state: msg.match[3].trim()}}));
      }
    }
  },
  tvs: {
    name: "tvs",
    regexp: "( \-\-[^ ]+)*( [^\-].+)?$",
    help: "[options] <on|off>",
    arg_params: "msg.match[1]",
    required_params: [
      "msg.match[2]"
    ],
    request_message: "\"Setting showroom tvs '\" + msg.match[2].trim() + \"'...\"",
    process: function(robot, action, msg) {
      for (var i =0; i < action.required_params.length; i++) {
        var required_param = action.required_params[i];
        
        if (!eval(required_param)) {
          msg.send(show_help(action) + "\n[options] can be :\n--output : use verbose output");
          return;
        }
      }

      msg.send(eval(action.request_message));

      var arg_params = get_arg_params(eval(action.arg_params));

      robot.emit('mqtt:pub', msg, process.env.HUBOT_SHOWROOM_PUBLISH_TOPIC_TVS, JSON.stringify({tv:{state: msg.match[2].trim()}}));
    }
  },
  hdmi_state: {
    name: "hdmi state",
    regexp: "( \-\-[^ ]+)*( [^\-].+)?$",
    help: "[options] <state>",
    arg_params: "msg.match[1]",
    required_params: [
      "msg.match[2]"
    ],
    request_message: "\"Requesting showroom hdmi state '\" + msg.match[2].trim() + \"'...\"",
    process: function(robot, action, msg) {
      for (var i =0; i < action.required_params.length; i++) {
        var required_param = action.required_params[i];
        
        if (!eval(required_param)) {
          msg.send(show_help(action) + "\n[options] can be :\n--output : use verbose output");
          return;
        }
      }

      msg.send(eval(action.request_message));

      var arg_params = get_arg_params(eval(action.arg_params));

      robot.emit('mqtt:pub', msg, process.env.HUBOT_SHOWROOM_PUBLISH_TOPIC_HDMI, JSON.stringify({hdmi:{command:{state:msg.match[2].trim().toUpperCase()}}}));
    }
  }
};

function get_arg_params(arg) {
  var output_capture, output;

  output_capture = /--output( |$)/.exec(arg);
  output = output_capture ? true : false;

  return {
    output: output
  };
};


function show_help(action) {
  return "Usage : " + cmd_char + command_name + " " + action.name + " " + action.help;
}

/*
function show_help() {
  var msg = "";

  for (var key in actions) {
    if (actions.hasOwnProperty(key)) {
      var action = actions[key];
    }
  }
  return "Usage : " + cmd_char + command_name + " " + action.name + " " + action.help;
}
*/

module.exports = function(robotAdapter) {
  var regx;
  robot = robotAdapter;
  subscriptions = {};
  var help_msg = "- Showroom commands -\n";
//  var negative_regx;

  for (var key in actions) {
    if (actions.hasOwnProperty(key)) {
      var action = actions[key];
      // Keep information for gobal help
      help_msg += action.name + "\n\t" + show_help(action) + "\n";
      regx = new RegExp("^@?(?:" + robot.name + "\\s+)?" + cmd_char + command_name + " " + action.name + action.regexp, "i");

      robot.hear(regx, {
        id: base_id + action.name
      }, action.process.bind(this, robot, action));

      robot.logger.info(">>> Showroom command added : " + action.name);
    }
  }

  regx = new RegExp("^@?(?:" + robot.name + "\\s+)?" + cmd_char + command_name + "( \-\-.+)*$", 'i');
  robot.hear(regx, {
    id: base_id + 'help'
  }, function(msg) {
    var msg_txt = help_msg;

    msg_txt += "\n[options] can be :\n--output : use verbose output";
    msg.send(msg_txt);
  });


  robot.on('help:get', function(msg, command, action_id) {
    // a message is passed
    if (msg) {
      // there is a command specified
      if (command) {
        // command is this command name
        if (command.toUpperCase() == command_name.toUpperCase()) {
          if (action_id) {
            // for each actions
            for (var key in actions) {
              if (actions.hasOwnProperty(key)) {
                // action is is equal to current iteration key
                if (action_id.toUpperCase() === key.toUpperCase()) {
                // send help message
                msg.send(show_help(actions[key]) + "\n[options] can be :\n--output : use verbose output");
                  // stop
                  break;
                }
              }
            }
          } else {
            // output full current command help
            var msg_txt = help_msg;

            msg_txt += "\n[options] can be :\n--output : use verbose output";
            msg.send(msg_txt);            
          }
        }
      } else {
        // output full current command help
        var msg_txt = help_msg;

        msg_txt += "\n[options] can be :\n--output : use verbose output";
        msg.send(msg_txt);
      }
    }
  });
};
