bl_info = {
    "name" : "Test addon",
    "author" : "Jan Šefčík",
    "version" : (1, 0),
    "blender" : (2, 91, 2),
    "name" : "View3d > Tool",
    "warning" : "",
    "wiki_url" : "",
    "category" : "Add Mesh",
}

import bpy
from mathutils import Matrix, Vector, Euler
import random

context = bpy.context
scene = context.scene

class MyProperties(bpy.types.PropertyGroup):
    object_name: bpy.props.StringProperty(default="Enter object name")
    object_size : bpy.props.FloatVectorProperty(name= "Scale", soft_min= 0, soft_max= 1000, default= (1,1,1))


class MyOperator(bpy.types.Operator):
    bl_idname = "object.my_operator"
    bl_label = "Add cube to the scene"
    
    def get_tree_location(self, name, context):
        locations = []
        for object in bpy.data.objects:  # All object in the scene
            if (name in object.name):
                coord = context.scene.objects[object.name].location  # Get object by name
                locations.append(coord)
        return locations
    
    def get_random_color(self):
        ''' generate rgb using a list comprehension '''
        r, g, b = [random.random() for i in range(3)]
        return r, g, b, 1
    
    def check_name(self, names, res):
        for name in names:
            if name in res:
                return True
        return False
    
    def get_wood(self):
        return (0.27,0.13,0.05,1)
    
    def get_glass(self):
        return (0.2,0.6,0.5,1)
    
    def get_conc(self):
        return (0.25,0.25,0.25,1)
    
    def get_brick(self):
        return (0.6,0.25,0.33,1)
    
    def execute(self, context):

        my_tool = scene.my_tool
        
        #----------------------------------------

        bpy.ops.object.select_all(action='DESELECT')  # Deselect all objects
        
        name = "tree-coord"  # name of the object
        path = "/Users/seva/Documents/_FIT/NI-CCC/maple.fbx"
        
        # Get locations of objects by name
        '''try:
            tree_locations = self.get_tree_location(my_tool.object_name, context)
        except:
            print("Object name does not exists")
            return {'CANCELLED'}'''
        
        counter = 0
        
        for obj in bpy.data.objects:
        
            mat = bpy.data.materials.get("randobjcol" + str(counter))
            if not mat:
                mat = bpy.data.materials.new("randobjcol" + str(counter))
                # mat.use_object_color = True

            counter += 1

        
            if ('Ziegel' in obj.name):
                mat.diffuse_color = self.get_brick()
            
            elif self.check_name(['Holz', 'leer', 'hart', 'STB', 'Rahmen', 'relement'], obj.name):
                mat.diffuse_color = self.get_wood()
                
            elif self.check_name(['Basic','Stair', 'Ciel', 'FE', 'Grau', 'rper', 'Mass', 'Landing', 'Run', 'Pfosten'], obj.name):
                mat.diffuse_color = self.get_conc()
            
            elif self.check_name(['Glas', 'glas'], obj.name):
                mat.diffuse_color = self.get_glass()
        
            elif ('Surface' in obj.name):
                mat.diffuse_color = (0.1,0.1,0,1)
        
            # assign to object
            # obj.active_material = mat
            try:
                obj.data.materials.append(mat)
            except:
                pass

        return {'FINISHED'}

class TestPanel(bpy.types.Panel):
    bl_label = "Architekt VR"
    bl_name = "PT_TestPanel"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Architekt model"
    
    def draw(self, context):
        layout = self.layout
        mytool = scene.my_tool
        # Properties
        layout.prop(mytool, "object_name")
        layout.prop(mytool, "object_size")

        row = layout.row()     
        row.label(text="Import by object name to all locations", icon = "CONSOLE")
        row = layout.row()
        row.operator(MyOperator.bl_idname, text="Import model")

classes = (
    MyProperties,
    TestPanel,
    MyOperator
)

def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    # Add QueryProps
    bpy.types.Scene.my_tool = bpy.props.PointerProperty(type=MyProperties)
    
    
def unregister():
    for cls in classes:
        bpy.utils.unregister_class(cls)
    # Del QueryProps
    del bpy.types.Scene.my_tool
    
if __name__ == "__main__":
    register()