#version 300 es

precision highp float;

out vec4 FragColor;
in vec3 fragPos;  
in vec3 normal;  
in vec2 texCoord;

struct Material {
    vec3 diffuse;
    vec3 specular;     // 표면의 specular color
    float shininess;   // specular 반짝임 정도
};

struct Light {
    //vec3 position;
    vec3 direction;
    vec3 ambient; // ambient 적용 strength
    vec3 diffuse; // diffuse 적용 strength
    vec3 specular; // specular 적용 strength
};

uniform Material material;
uniform Light light;
uniform vec3 u_viewPos;
uniform int level;

void main() {
    // ambient
    vec3 rgb = material.diffuse;
    vec3 ambient = light.ambient * rgb;
  	
    // diffuse 
    vec3 norm = normalize(normal);
    //vec3 lightDir = normalize(light.position - fragPos);
    vec3 lightDir = normalize(light.direction);
    float dotNormLight = dot(norm, lightDir);

    float diff=max(dotNormLight, 0.0);

    if(level==1){
        diff=0.0;
    }

    else if (level==2){
        if(dotNormLight<=0.0){
            diff=0.0;
        }

        else{
            diff=0.333;
        }

    }

    else if (level==3){
        if(dotNormLight<=0.0){
            diff=0.0;
        }


        else if(dotNormLight<=0.666){
            diff=0.333;
        }

        else{
            diff=1.0;
        }
    }

    else if (level==4){
        if(dotNormLight<=0.0){
            diff=0.0;
        }


        else if(dotNormLight<=0.333){
            diff=0.333;
        }

        else if(dotNormLight<=0.666){
            diff=0.666;
        }

        else{
            diff=1.0;
        }
        
    }

    else if (level==5){
        if(dotNormLight<=0.0){
            diff=0.0;
        }


        else if(dotNormLight<=0.222){
            diff=0.222;
        }

        else if(dotNormLight<=0.444){
            diff=0.555;
        }

        else if(dotNormLight<=0.666){
            diff=0.777;
        }

        else{
            diff=1.0;
        }
        
    }

    vec3 diffuse = light.diffuse * diff * rgb;  
    
    // specular
    vec3 viewDir = normalize(u_viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    
    float spec = 0.0;
    float specliteral=0.0;
    if (dotNormLight > 0.0) {
        spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);

        if(level==1){
            spec=0.0;
        }

        else if(level==2){
            if(spec<=0.5){
                spec=0.0;
            }

            else{
                spec=0.5;
            }
        }

        else if(level==3){
            if(spec<=0.333){
                spec=0.111;
            }

            else if(spec<=0.666){
                spec=0.6;
            }
            else{
                spec=1.0;
            }
        }

        else if(level==4){
            if(spec<=0.222){
                spec=0.0;
            }

            else if(spec<=0.444){
                spec=0.333;
            }

            else if(spec<=0.666){
                spec=0.666;
            }
            else{
                spec=1.0;
            }
        }

        else if(level==5){
            if(spec<=0.222){
                spec=0.0;
            }

            else if(spec<=0.444){
                spec=0.333;
            }

            else if(spec<=0.666){
                spec=0.666;
            }

            else if(spec<=0.888){
                spec=0.888;
            }
            else{
                spec=1.0;
            }
        }
    }
    vec3 specular = light.specular * spec * material.specular;  
        
    vec3 result = ambient + diffuse + specular;
    FragColor = vec4(result, 1.0);
} 