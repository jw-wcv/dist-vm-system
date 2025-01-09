import bpy
import sys

scene_file = sys.argv[1]
output_path = sys.argv[2]

bpy.ops.wm.open_mainfile(filepath=scene_file)
bpy.ops.render.render(write_still=True)
bpy.path.abspath(output_path)