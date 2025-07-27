# render-script.py
# 
# Description: Blender automation script for distributed rendering
# 
# This script automates Blender rendering tasks for the distributed VM system.
# It opens a Blender scene file and renders it to a specified output path,
# enabling batch rendering across multiple worker VMs.
# 
# Inputs: 
#   - sys.argv[1]: Path to Blender scene file (.blend)
#   - sys.argv[2]: Output path for rendered image
# Outputs: 
#   - Rendered image file at specified output path
#   - Console output with rendering progress
# 
# Usage: python render-script.py scene.blend output.png
# 
# Dependencies:
#   - Blender Python API (bpy)
#   - Blender installation with Python support
#   - Valid Blender scene file
#   - Write permissions for output directory

import bpy
import sys

scene_file = sys.argv[1]
output_path = sys.argv[2]

bpy.ops.wm.open_mainfile(filepath=scene_file)
bpy.ops.render.render(write_still=True)
bpy.path.abspath(output_path)