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
    
    def execute(self, context):

        my_tool = scene.my_tool
        
        #----------------------------------------

        bpy.ops.object.select_all(action='DESELECT')  # Deselect all objects
        
        name = "tree-coord"  # name of the object
        path = "/Users/seva/Documents/_FIT/NI-CCC/maple.fbx"
        
        # Get locations of objects by name
        try:
            tree_locations = self.get_tree_location(my_tool.object_name, context)
        except:
            print("Object name does not exists")
            return {'CANCELLED'}
        
        for coord in tree_locations:
            # Create new collection for model
            my_collection = bpy.data.collections.new("TreeColection")
            bpy.context.scene.collection.children.link(my_collection)
            
           # Load model into the scene
            bpy.ops.import_scene.fbx(filepath=path)  # Import tree model
            
            # Move selected objects (imported model) to the new collection
            for ob in bpy.context.selected_objects:
                my_collection.objects.link(ob)
                bpy.context.scene.collection.objects.unlink(ob)
                bpy.ops.transform.resize(
                    value=(my_tool.object_size[0], my_tool.object_size[1], my_tool.object_size[2]), # this is the transformation X,Y,Z
                    constraint_axis=(False, False, False))
            
            # Set location for each mesh in collection
            for mesh in my_collection.objects:
                tree = context.scene.objects[mesh.name]  # Get object by name
                tree.location = coord
            
            # remove used coord  
            tree_locations = tree_locations[1:]

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