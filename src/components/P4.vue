<template>
    <div id="all">
        <h1>Puissance 4</h1>
        <p id="result"></p>
        <div id="container"></div>
    </div>
</template>c

<script>
import * as Three from "three";
export default {
    name: "P4",
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
            let tailleTab = 7;
            this.camera = new Three.PerspectiveCamera(
                45,
                container.clientWidth / container.clientHeight,
                0.01,
                20
            );
            this.camera.position.z = 15;
            this.camera.position.x = tailleTab / 2.4;
            this.camera.position.y = tailleTab / 2.5;

            this.scene = new Three.Scene();
            let tab = [];
            let tile = [];

            const geometry = new Three.PlaneGeometry(0.8, 0.8);
            const base = new Three.MeshBasicMaterial({
                color: 0x778899,
                side: Three.DoubleSide,
            });

            //generation map
            for (let i = 0; i < tailleTab; i++) {
                tab[i] = [];
                tile[i] = [];
                for (let j = 0; j < tailleTab - 1; j++) {
                    tab[i][j] = 0;
                    tile[i][j] = new Three.Mesh(geometry, base);
                    this.scene.add(tile[i][j]);

                    tile[i][j].position.x = i;
                    tile[i][j].position.y = j;
                }
            }
            for (let i = -1; i > -tailleTab; i--) {
                tab[i] = [];
                tile[i] = [];
                for (let j = -1; j > -tailleTab + 1; j--) {
                    tab[i][j] = -1;
                }
            }

            //+++++++++++++++++++++++++++++++++++++++++++

            function highlightUsedCase(scene, xVal, yVal, color) {
                const geometry = new Three.CircleGeometry(0.25, 32);
                const mat = new Three.MeshBasicMaterial({
                    color: color,
                    side: Three.DoubleSide,
                });
                const plane = new Three.Mesh(geometry, mat);
                scene.add(plane);
                plane.position.x = xVal;
                plane.position.y = yVal;
            }
            function checkWinner() {
                let x = tailleTab - 1;
                let y = tailleTab - 2;

                while (x >= 0) {
                    while (y >= 0) {
                        let pion = tab[x][y];

                        if (pion !== 0) {
                            if (x > 2) {
                                var pion2 = tab[x - 1][y];
                                var pion3 = tab[x - 2][y];
                                var pion4 = tab[x - 3][y];

                                if (
                                    pion == pion2 &&
                                    pion2 == pion3 &&
                                    pion3 == pion4
                                ) {
                                    return pion;
                                }
                            }

                            if (y > 2) {
                                var pion2 = tab[x][y - 1];
                                var pion3 = tab[x][y - 2];
                                var pion4 = tab[x][y - 3];

                                if (
                                    pion == pion2 &&
                                    pion2 == pion3 &&
                                    pion3 == pion4
                                ) {
                                    return pion;
                                }
                            }

                            if (x > 2 && y < 4) {
                                var pion2 = tab[x - 1][y + 1];
                                var pion3 = tab[x - 2][y + 2];
                                var pion4 = tab[x - 3][y + 3];

                                if (
                                    pion == pion2 &&
                                    pion2 == pion3 &&
                                    pion3 == pion4
                                ) {
                                    return pion;
                                }
                            }

                            if (x > 2 && y > 2) {
                                var pion2 = tab[x - 1][y - 1];
                                var pion3 = tab[x - 2][y - 2];
                                var pion4 = tab[x - 3][y - 3];

                                if (
                                    pion == pion2 &&
                                    pion2 == pion3 &&
                                    pion3 == pion4
                                ) {
                                    return pion;
                                }
                            }
                        }

                        y--;
                    }

                    x--;
                    y = tailleTab - 2;
                }

                x = tailleTab - 1;

                let foundZero = 0;
                while (x >= 0) {
                    if (tab[x].indexOf(0) >= 0) {
                        foundZero++;
                    }

                    x--;
                }

                if (foundZero == 0) {
                    return "equality";
                }

                return false;
            }
            function addPion(x) {
                let position = {
                    x: x,
                    y: null,
                };

                for (let index = 0; index < tab[x].length; index++) {
                    const element = tab[x][index];

                    if (element == 0) {
                        position.y = index;
                        break;
                    }
                }

                return position;
            }

            const players = [
                {
                    id: 1,
                    name: "IA clone 1",
                    color: 0xfa2d14,
                },
                {
                    id: 2,
                    name: "IA clone 2",
                    color: 0x00fa4b,
                },
            ];

            function algo(player) {
                let possibleMoves = [[], [], [], []];
                function pushMove(move, efficiency) {
                    if (tab[move.x][move.y - 1] != 0) {
                        switch (efficiency) {
                            case 0:
                                possibleMoves[0].push({
                                    x: move.x,
                                    y: move.y,
                                    efficiency: efficiency,
                                });
                                break;
                            case 4:
                                possibleMoves[1].push({
                                    x: move.x,
                                    y: move.y,
                                    efficiency: efficiency,
                                });
                                break;
                            case 3:
                                possibleMoves[2].push({
                                    x: move.x,
                                    y: move.y,
                                    efficiency: efficiency,
                                });
                                break;
                            case 2:
                                possibleMoves[3].push({
                                    x: move.x,
                                    y: move.y,
                                    efficiency: efficiency,
                                });
                                break;
                        }
                    }
                }

                let pionsPlayed = 0;
                let solution;

                for (let i = 0; i < tailleTab; i++) {
                    for (let j = 0; j < tailleTab - 1; j++) {
                        if (tab[i][j] != 0) {
                            pionsPlayed++;
                        }
                        if (tab[i][j] == player.id) {
                            const aroundPions = [
                                { x: i, y: j + 1 },
                                { x: i + 1, y: j + 1 },
                                { x: i + 1, y: j },
                                { x: i + 1, y: j - 1 },
                                // { x: i, y: j - 1 },
                                { x: i - 1, y: j - 1 },
                                { x: i - 1, y: j },
                                { x: i - 1, y: j + 1 },
                            ];

                            for (
                                let index = 0;
                                index < aroundPions.length;
                                index++
                            ) {
                                switch (index) {
                                    case 0:
                                        if (
                                            tab[aroundPions[index].x][
                                                aroundPions[index].y
                                            ] == 0
                                        ) {
                                            if (
                                                tab[i][j - 1] == player.id &&
                                                tab[i][j - 2] == player.id
                                            ) {
                                                pushMove(aroundPions[index], 4);
                                            } else if (
                                                tab[i][j - 1] == player.id
                                            ) {
                                                pushMove(aroundPions[index], 3);
                                            } else {
                                                pushMove(aroundPions[index], 2);
                                            }
                                        }
                                        break;
                                    case 1:
                                        try {
                                            if (
                                                tab[aroundPions[index].x][
                                                    aroundPions[index].y
                                                ] == 0
                                            ) {
                                                if (
                                                    tab[i - 1][j - 1] ==
                                                        player.id &&
                                                    tab[i - 2][j - 2] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 2][j + 2] ==
                                                        player.id &&
                                                    tab[i + 3][j + 3] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 1][j - 1] ==
                                                        player.id &&
                                                    tab[i + 2][j + 2] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 1][j - 1] ==
                                                        player.id &&
                                                    (tab[i + 2][j + 2] == 0 ||
                                                        tab[i - 2][j - 2] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    tab[i + 2][j + 2] ==
                                                        player.id &&
                                                    (tab[i + 3][j + 3] == 0 ||
                                                        tab[i - 1][j - 1] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    (tab[i + 2][j + 2] == 0 &&
                                                        tab[i + 3][j + 3] ==
                                                            0) ||
                                                    (tab[i - 1][j - 1] == 0 &&
                                                        tab[i - 2][j - 2] ==
                                                            0) ||
                                                    (tab[i + 2][j + 2] == 0 &&
                                                        tab[i - 1][j - 1] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        2
                                                    );
                                                }
                                            }
                                            break;
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    case 2:
                                        try {
                                            if (
                                                tab[aroundPions[index].x][
                                                    aroundPions[index].y
                                                ] == 0
                                            ) {
                                                if (
                                                    tab[i - 1][j] ==
                                                        player.id &&
                                                    tab[i - 2][j] == player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 2][j] ==
                                                        player.id &&
                                                    tab[i + 3][j] == player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 1][j] ==
                                                        player.id &&
                                                    tab[i + 2][j] == player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 1][j] ==
                                                        player.id &&
                                                    (tab[i + 2][j] == 0 ||
                                                        tab[i - 2][j] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    tab[i + 2][j] ==
                                                        player.id &&
                                                    (tab[i + 3][j] == 0 ||
                                                        tab[i - 1][j] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    (tab[i + 2][j] == 0 &&
                                                        tab[i + 3][j] == 0) ||
                                                    (tab[i - 1][j] == 0 &&
                                                        tab[i - 2][j] == 0) ||
                                                    (tab[i + 2][j] == 0 &&
                                                        tab[i - 1][j] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        2
                                                    );
                                                }
                                            }
                                            break;
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    case 3:
                                        try {
                                            if (
                                                tab[aroundPions[index].x][
                                                    aroundPions[index].y
                                                ] == 0
                                            ) {
                                                if (
                                                    tab[i - 1][j + 1] ==
                                                        player.id &&
                                                    tab[i - 2][j + 2] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 2][j - 2] ==
                                                        player.id &&
                                                    tab[i + 3][j - 3] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 1][j + 1] ==
                                                        player.id &&
                                                    tab[i + 2][j - 2] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 1][j + 1] ==
                                                        player.id &&
                                                    (tab[i + 2][j - 2] == 0 ||
                                                        tab[i - 2][j + 2] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    tab[i + 2][j - 2] ==
                                                        player.id &&
                                                    (tab[i + 3][j - 3] == 0 ||
                                                        tab[i - 1][j + 1] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    (tab[i + 2][j - 2] == 0 &&
                                                        tab[i + 3][j - 3] ==
                                                            0) ||
                                                    (tab[i - 1][j + 1] == 0 &&
                                                        tab[i - 2][j + 2] ==
                                                            0) ||
                                                    (tab[i + 2][j - 2] == 0 &&
                                                        tab[i - 1][j + 1] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        2
                                                    );
                                                }
                                            }
                                            break;
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    case 4:
                                        try {
                                            if (
                                                tab[aroundPions[index].x][
                                                    aroundPions[index].y
                                                ] == 0
                                            ) {
                                                if (
                                                    tab[i + 1][j + 1] ==
                                                        player.id &&
                                                    tab[i + 2][j + 2] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 2][j - 2] ==
                                                        player.id &&
                                                    tab[i - 3][j - 3] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 1][j + 1] ==
                                                        player.id &&
                                                    tab[i - 2][j - 2] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 1][j + 1] ==
                                                        player.id &&
                                                    (tab[i - 2][j - 2] == 0 ||
                                                        tab[i + 2][j + 2] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    tab[i - 2][j - 2] ==
                                                        player.id &&
                                                    (tab[i - 3][j - 3] == 0 ||
                                                        tab[i + 1][j + 1] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    (tab[i - 2][j - 2] == 0 &&
                                                        tab[i - 3][j - 3] ==
                                                            0) ||
                                                    (tab[i + 1][j + 1] == 0 &&
                                                        tab[i + 2][j + 2] ==
                                                            0) ||
                                                    (tab[i - 2][j - 2] == 0 &&
                                                        tab[i + 1][j + 1] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        2
                                                    );
                                                }
                                            }
                                            break;
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    case 5:
                                        try {
                                            if (
                                                tab[aroundPions[index].x][
                                                    aroundPions[index].y
                                                ] == 0
                                            ) {
                                                if (
                                                    tab[i + 1][j] ==
                                                        player.id &&
                                                    tab[i + 2][j] == player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 2][j] ==
                                                        player.id &&
                                                    tab[i - 3][j] == player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 1][j] ==
                                                        player.id &&
                                                    tab[i - 2][j] == player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 1][j] ==
                                                        player.id &&
                                                    (tab[i - 2][j] == 0 ||
                                                        tab[i + 2][j] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    tab[i - 2][j] ==
                                                        player.id &&
                                                    (tab[i - 3][j] == 0 ||
                                                        tab[i + 1][j] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    (tab[i - 2][j] == 0 &&
                                                        tab[i - 3][j] == 0) ||
                                                    (tab[i + 1][j] == 0 &&
                                                        tab[i + 2][j] == 0) ||
                                                    (tab[i - 2][j] == 0 &&
                                                        tab[i + 1][j] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        2
                                                    );
                                                }
                                            }
                                            break;
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    case 6:
                                        try {
                                            if (
                                                tab[aroundPions[index].x][
                                                    aroundPions[index].y
                                                ] == 0
                                            ) {
                                                if (
                                                    tab[i + 1][j - 1] ==
                                                        player.id &&
                                                    tab[i + 2][j - 2] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i - 2][j + 2] ==
                                                        player.id &&
                                                    tab[i - 3][j + 3] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 1][j - 1] ==
                                                        player.id &&
                                                    tab[i - 2][j + 2] ==
                                                        player.id
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        4
                                                    );
                                                } else if (
                                                    tab[i + 1][j - 1] ==
                                                        player.id &&
                                                    (tab[i - 2][j + 2] == 0 ||
                                                        tab[i + 2][j - 2] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    tab[i - 2][j + 2] ==
                                                        player.id &&
                                                    (tab[i - 3][j + 3] == 0 ||
                                                        tab[i + 1][j - 1] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        3
                                                    );
                                                } else if (
                                                    (tab[i - 2][j + 2] == 0 &&
                                                        tab[i - 3][j + 3] ==
                                                            0) ||
                                                    (tab[i + 1][j - 1] == 0 &&
                                                        tab[i + 2][j - 2] ==
                                                            0) ||
                                                    (tab[i - 2][j + 2] == 0 &&
                                                        tab[i + 1][j - 1] == 0)
                                                ) {
                                                    pushMove(
                                                        aroundPions[index],
                                                        2
                                                    );
                                                }
                                            }
                                            break;
                                        } catch (error) {
                                            console.log(error);
                                        }
                                }
                            }
                        }
                    }
                }

                if (pionsPlayed == 0) {
                    pushMove({ x: 3, y: 0 }, 0);
                } else if (pionsPlayed == 1) {
                    pushMove({ x: 2, y: 0 }, 0);
                    pushMove({ x: 4, y: 0 }, 0);
                    pushMove({ x: 3, y: 1 }, 0);
                }

                console.log(possibleMoves);

                if (possibleMoves[0].length !== 0) {
                    let selected = Math.floor(
                        Math.random() * (possibleMoves[0].length - 1 - 0 + 1) +
                            0
                    );
                    solution = possibleMoves[0][selected].x;
                } else if (possibleMoves[1].length !== 0) {
                    let selected = Math.floor(
                        Math.random() * (possibleMoves[1].length - 1 - 0 + 1) +
                            0
                    );
                    solution = possibleMoves[1][0].x;
                } else if (possibleMoves[2].length !== 0) {
                    let selected = Math.floor(
                        Math.random() * (possibleMoves[2].length - 1 - 0 + 1) +
                            0
                    );
                    solution = possibleMoves[2][0].x;
                } else if (possibleMoves[3].length !== 0) {
                    // let selected = Math.floor(
                    //     Math.random() * (possibleMoves[3].length - 1 - 0 + 1) +
                    //         0
                    // );
                    // solution = possibleMoves[3][0].x;
                    solution = Math.floor(Math.random() * (6 - 0) + 0);
                }

                return solution;
            }

            let end = false;
            let player = players[0];
            let pionCol = 3;

            while (end == false) {
                console.log(pionCol);
                let position = addPion(pionCol);
                highlightUsedCase(
                    this.scene,
                    position.x,
                    position.y,
                    player.color
                );
                tab[position.x][position.y] = player.id;

                if (checkWinner() != false) {
                    end = true;

                    let winnerId = checkWinner();

                    const paragraph = document.getElementById("result");
                    let text;

                    if (winnerId == 1) {
                        text = document.createTextNode(
                            `Winner is ${players[0].name}`
                        );
                    } else {
                        text = document.createTextNode(
                            `Winner is ${players[1].name}`
                        );
                    }

                    paragraph.appendChild(text);
                }

                if (player.name == players[0].name) {
                    player = players[1];
                } else if (player.name == players[1].name) {
                    player = players[0];
                }

                pionCol = algo(player);
            }

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
    width: 800px;
    height: 500px;
    margin-left: auto;
    margin-right: auto;
}
</style>