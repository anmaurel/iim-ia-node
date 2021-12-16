<template>
    <div id="all">
        <h1>Dijkstra</h1>
        <p id="result"></p>
        <div id="container"></div>
    </div>
</template>

<script>
import * as Three from "three";
export default {
    name: "Dijkstra",
    data() {
        return {
            scene: undefined,
            camera: undefined,
            renderer: undefined,
        };
    },
    methods: {
        init: function () {
            let container = document.getElementById("container");
            let tailleTab = 16;
            this.camera = new Three.PerspectiveCamera(
                70,
                container.clientWidth / container.clientHeight,
                0.01,
                20
            );
            this.camera.position.z = 15;
            this.camera.position.x = tailleTab / 2;
            this.camera.position.y = tailleTab / 2;

            this.scene = new Three.Scene();
            let tab = [];
            let tile = [];

            const geometry = new Three.PlaneGeometry(1, 1);
            const terre = new Three.MeshBasicMaterial({
                color: 0x32cd32,
                side: Three.DoubleSide,
            });
            const lave = new Three.MeshBasicMaterial({
                color: 0xed0000,
                side: Three.DoubleSide,
            });

            //generation map
            for (let i = 0; i < tailleTab; i++) {
                tab[i] = [];
                tile[i] = [];
                for (let j = 0; j < tailleTab; j++) {
                    let mat = terre;
                    tab[i][j] = "terre";
                    if (Math.floor(Math.random() * 3) == 0) {
                        mat = lave;
                        tab[i][j] = "lave";
                    }
                    tile[i][j] = new Three.Mesh(geometry, mat);
                    this.scene.add(tile[i][j]);
                    //console.log(i + "  " +j)
                    tile[i][j].position.x = i;
                    tile[i][j].position.y = j;
                }
            }

            let xkey = Math.floor(Math.random() * tailleTab);
            let ykey = Math.floor(Math.random() * tailleTab);
            tab[xkey][ykey] = "key";
            tile[xkey][ykey].material = new Three.MeshBasicMaterial({
                color: 0xffff00,
                side: Three.DoubleSide,
            });

            //generation hero
            let x = xkey;
            let y = ykey;
            while (x == xkey && y == ykey) {
                x = Math.floor(Math.random() * tailleTab);
                y = Math.floor(Math.random() * tailleTab);
            }
            tab[x][y] = "hero";
            tile[x][y].material = new Three.MeshBasicMaterial({
                color: 0xf4fefe,
                side: Three.DoubleSide,
            });

            //+++++++++++++++++++++++++++++++++++++++++++

            function highlightCheckCase(scene, xVal, yVal, colortile) {
                const geometry = new Three.PlaneGeometry(0.7, 0.7);
                const mat = new Three.MeshBasicMaterial({
                    color: colortile,
                    side: Three.DoubleSide,
                });
                const plane = new Three.Mesh(geometry, mat);
                scene.add(plane);
                plane.position.x = xVal;
                plane.position.y = yVal;
            }

            let scene = this.scene;

            function solver() {
                let xQueue = [x];
                let yQueue = [y];

                let solution = false;

                let xLocation;
                let yLocation;

                while (xQueue.length > 0 && !solution) {
                    xLocation = xQueue.shift();
                    yLocation = yQueue.shift();

                    // key block
                    if (xLocation > 0) {
                        if (tab[xLocation - 1][yLocation] == "key") {
                            solution = true;
                        }
                    }
                    if (xLocation < tab[xLocation].length - 1) {
                        if (tab[xLocation + 1][yLocation] == "key") {
                            solution = true;
                        }
                    }
                    if (yLocation > 0) {
                        if (tab[xLocation][yLocation - 1] == "key") {
                            solution = true;
                        }
                    }
                    if (yLocation < tab[yLocation].length - 1) {
                        if (tab[xLocation][yLocation + 1] == "key") {
                            solution = true;
                        }
                    }

                    // terre block
                    if (xLocation > 0) {
                        if (tab[xLocation - 1][yLocation] == "terre") {
                            xQueue.push(xLocation - 1);
                            yQueue.push(yLocation);
                            tab[xLocation - 1][yLocation] =
                                tab[xLocation][yLocation] + "left";
                            highlightCheckCase(
                                scene,
                                xLocation - 1,
                                yLocation,
                                0x60a4e0
                            );
                        }
                    }
                    if (xLocation < tab[xLocation].length - 1) {
                        if (tab[xLocation + 1][yLocation] == "terre") {
                            xQueue.push(xLocation + 1);
                            yQueue.push(yLocation);
                            tab[xLocation + 1][yLocation] =
                                tab[xLocation][yLocation] + "right";
                            highlightCheckCase(
                                scene,
                                xLocation + 1,
                                yLocation,
                                0x60a4e0
                            );
                        }
                    }
                    if (yLocation > 0) {
                        if (tab[xLocation][yLocation - 1] == "terre") {
                            xQueue.push(xLocation);
                            yQueue.push(yLocation - 1);
                            tab[xLocation][yLocation - 1] =
                                tab[xLocation][yLocation] + "top";
                            highlightCheckCase(
                                scene,
                                xLocation,
                                yLocation - 1,
                                0x60a4e0
                            );
                        }
                    }
                    if (yLocation < tab[yLocation].length - 1) {
                        if (tab[xLocation][yLocation + 1] == "terre") {
                            xQueue.push(xLocation);
                            yQueue.push(yLocation + 1);
                            tab[xLocation][yLocation + 1] =
                                tab[xLocation][yLocation] + "bottom";
                            highlightCheckCase(
                                scene,
                                xLocation,
                                yLocation + 1,
                                0x60a4e0
                            );
                        }
                    }
                }

                const paragraph = document.getElementById("result");
                let text;

                if (!solution) {
                    text = document.createTextNode(
                        "Impossible to find the key."
                    );
                } else {
                    text = document.createTextNode("Key found !");

                    let path = tab[xLocation][yLocation];
                    let heroX = x;
                    let heroY = y;

                    for (let i = 0; i < path.length - 1; i++) {
                        if (path.charAt(i + 1) == "top") {
                            heroY -= 1;
                        }
                        if (path.charAt(i + 1) == "bottom") {
                            heroY += 1;
                        }
                        if (path.charAt(i + 1) == "right") {
                            heroX += 1;
                        }
                        if (path.charAt(i + 1) == "left") {
                            heroX -= 1;
                        }
                    }
                }

                paragraph.appendChild(text);
            }

            solver();

            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            this.renderer = new Three.WebGLRenderer({ antialias: true });
            this.renderer.setSize(
                container.clientWidth,
                container.clientHeight
            );
            container.appendChild(this.renderer.domElement);
        },
        animate: function () {
            requestAnimationFrame(this.animate);
            //this.mesh.rotation.x += 0.01;
            //this.mesh.rotation.y += 0.02;
            this.renderer.render(this.scene, this.camera);
        },
    },
    mounted() {
        this.init();
        this.animate();
    },
};
</script>

<style scoped>
#container {
    width: 1000px;
    height: 700px;
    margin-left: auto;
    margin-right: auto;
}
</style>