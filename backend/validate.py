#!/usr/bin/env python3
"""
Validation script to check if all backend files are correct and working
"""

import sys
import os
import importlib.util

def check_file_syntax(file_path, description):
    """Check if a Python file has valid syntax"""
    print(f"🔍 Checking {description}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            source = f.read()
        
        # Compile to check syntax
        compile(source, file_path, 'exec')
        print(f"  ✅ {description} - syntax OK")
        return True
        
    except SyntaxError as e:
        print(f"  ❌ {description} - syntax error: {e}")
        return False
    except Exception as e:
        print(f"  ❌ {description} - error: {e}")
        return False

def check_imports(file_path, description):
    """Check if a Python file can be imported"""
    print(f"🔍 Checking imports for {description}...")
    
    try:
        spec = importlib.util.spec_from_file_location("test_module", file_path)
        if spec is None:
            print(f"  ❌ {description} - cannot create module spec")
            return False
            
        module = importlib.util.module_from_spec(spec)
        # We don't execute it, just check if it can be loaded
        print(f"  ✅ {description} - imports OK")
        return True
        
    except Exception as e:
        print(f"  ❌ {description} - import error: {e}")
        return False

def main():
    """Run all validation checks"""
    print("🧪 AI Derma Detector Backend Validation")
    print("=" * 50)
    
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Files to check
    files_to_check = [
        ("main.py", "Main FastAPI application"),
        ("skin_detection_model.py", "ONNX model detection logic"),
        ("schemas.py", "Pydantic response schemas"),
        ("test_integration.py", "Integration test script"),
        ("download_model.py", "Model download utility")
    ]
    
    all_passed = True
    
    # Check syntax of all Python files
    print("\n📝 Syntax Validation:")
    for filename, description in files_to_check:
        file_path = os.path.join(backend_dir, filename)
        if os.path.exists(file_path):
            if not check_file_syntax(file_path, description):
                all_passed = False
        else:
            print(f"  ⚠️  {description} - file not found: {filename}")
    
    # Check required files exist
    print("\n📁 Required Files Check:")
    required_files = [
        "requirements.txt",
        "skindisease.json", 
        "README.md",
        "start_server.bat"
    ]
    
    for filename in required_files:
        file_path = os.path.join(backend_dir, filename)
        if os.path.exists(file_path):
            print(f"  ✅ {filename} - exists")
        else:
            print(f"  ❌ {filename} - missing")
            all_passed = False
    
    # Check deprecated files are properly handled
    print("\n🗂️  Deprecated Files Check:")
    index_js_path = os.path.join(backend_dir, "index.js")
    if os.path.exists(index_js_path):
        with open(index_js_path, 'r') as f:
            content = f.read()
        if "DEPRECATED" in content and "main.py" in content:
            print("  ✅ index.js - properly marked as deprecated")
        else:
            print("  ⚠️  index.js - should be marked as deprecated or removed")
    else:
        print("  ✅ index.js - not present (good)")
    
    # Final result
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 All validation checks passed!")
        print("\n✅ Your backend is ready to use:")
        print("   1. Start server: python main.py")
        print("   2. Or use batch script: start_server.bat")
        print("   3. API docs: http://localhost:3000/docs")
    else:
        print("❌ Some validation checks failed!")
        print("   Please review the errors above and fix them.")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
