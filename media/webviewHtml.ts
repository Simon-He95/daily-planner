export function getwebviewHtml() {
  return `
  <div id="app">
    <div :class="[mode ? 'darkMode' : 'lightMode']" class="daily-planner">
      <div class="bg"></div>
      <div class="loading" :class="[closeLoading && 'closeLoading']">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="#ffffff"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="#ffffff"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="#ffffff"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>
      </div>
      <div class="btn-wrapper" :class="[large ? 'large' : 'small']">
        <div class="btn" @click="add('plan')">
          <svg class="add" t="1686147426213" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="36207" width="16" height="16"><path d="M658.359392 961.641767 384.28627 961.641767c-32.556487 0-60.125379-17.573237-75.592652-48.226375-0.549515-1.083681-1.38351-2.901073-1.766226-4.069689l-73.225745-220.322941c-11.094686-20.37505-13.916964-43.801599-7.910157-66.277496 6.307659-23.563672 21.526269-43.221384 42.838667-55.369052 13.883195-7.91118 29.652344-12.099572 45.588291-12.099572 24.028253 0 46.89096 9.426697 63.760163 25.600051l-0.068562-197.309808c0-51.849902 42.856064-94.019327 95.534843-94.019327 52.683896 0 95.535867 42.169425 95.535867 94.019327l0 160.962995C731.580021 558.781466 733.24801 559.065945 734.450395 559.263443c50.461275 8.309246 84.419691 43.736107 84.419691 88.174202 0 3.15383 0 10.565636-49.077765 244.251933C755.126296 944.385754 727.108173 961.641767 658.359392 961.641767L658.359392 961.641767zM353.817328 891.690602c4.886287 9.276271 14.080693 19.890003 30.468942 19.890003l274.073122 0c53.946656 0 56.365752-8.645914 62.84021-31.754215 17.054421-81.518618 45.056172-216.635969 47.609321-233.587036-0.75213-22.644743-22.310122-34.259268-42.499953-37.579897-4.322445-0.416486-112.890117-9.981329-184.526667-16.254196-12.916171-1.134847-22.845311-11.946077-22.845311-24.930809L518.936993 383.584282c0-24.230867-20.409842-43.956118-45.473681-43.956118s-45.473681 19.726274-45.473681 43.956118l0.103354 315.019697c0 12.146645-8.714476 22.542412-20.675902 24.659633-11.899004 2.12336-23.696702-4.652973-27.868721-16.064884l-30.271444-83.053578c-11.480472-17.590634-37.111223-23.928992-55.831586-13.251815-9.612938 5.474688-16.45681 14.286378-19.276019 24.814152-2.788509 10.380418-1.302669 21.209044 4.13825 30.502711 0.884137 1.503237 1.602498 3.106758 2.153036 4.756327L353.817328 891.690602 353.817328 891.690602zM353.817328 891.690602" p-id="36208"></path><path d="M308.126706 329.8648l-100.405781-2.142803c-15.190981-0.316202-27.430746 12.0525-27.491121 28.109198-0.039909 16.023952 12.148691 29.569456 27.284413 29.890774l100.406804 2.146896c15.517415 0.324388 28.109198-12.688997 28.149107-28.713972C336.162226 343.122755 323.647191 330.190211 308.126706 329.8648L308.126706 329.8648zM760.529353 368.170221c0.037862-16.021905-12.150738-28.943193-27.996634-29.27986l-99.718119-2.100848c-15.84385-0.334621-28.112268 12.063757-28.149107 28.090778-0.039909 16.024975 12.149714 29.569456 27.994588 29.906124l99.721189 2.098801C748.226143 397.22086 760.488421 384.195196 760.529353 368.170221L760.529353 368.170221zM498.68167 91.315752c0.027629-15.696494-12.129248-28.593222-28.004821-28.952402-14.862499-0.303922-27.432793 12.054547-27.460422 27.752064l-0.26913 104.052844c-0.051165 15.72617 12.456706 28.601408 27.317159 28.907377 15.84692 0.333598 28.118408-12.011568 28.17162-27.735691L498.68167 91.315752 498.68167 91.315752zM565.256948 266.072915c10.879792 11.487635 28.665877 11.862165 39.642882 0.835018l70.850651-71.877027c10.952446-10.999518 11.009751-29.125341 0.112564-40.96397-10.878768-11.487635-28.664853-11.862165-39.619346-0.864694l-70.900793 71.885214C554.425252 236.160651 554.389436 254.256798 565.256948 266.072915L565.256948 266.072915zM376.006699 262.061554c10.607592-11.358699 10.642384-29.454846 0.113587-40.959877l-70.481238-74.878384c-11.534707-11.508102-28.993335-11.874445-39.642882-0.833995-11.612479 11.359722-11.649318 29.450752-0.11154 40.960901l70.480214 74.876338C346.94071 272.674263 364.42492 273.064143 376.006699 262.061554L376.006699 262.061554zM376.006699 262.061554" p-id="36209"></path></svg>
          <span class="title">今日计划</span>
        </div>
        <div class="btn" @click="add('day')">
          <svg class="add-day" t="1686148480864" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="45398" width="16" height="16"><path d="M512 170.666667 512 42.666667 341.333333 213.333333l170.666667 170.666667L512 256c140.8 0 256 115.2 256 256 0 42.666667-12.8 85.333333-29.866667 119.466667l64 64C832 640 853.333333 580.266667 853.333333 512 853.333333 324.266667 699.733333 170.666667 512 170.666667zM512 768c-140.8 0-256-115.2-256-256 0-42.666667 12.8-85.333333 29.866667-119.466667L221.866667 328.533333C192 384 170.666667 443.733333 170.666667 512c0 187.733333 153.6 341.333333 341.333333 341.333333l0 128 170.666667-170.666667-170.666667-170.666667L512 768z" p-id="45399"></path></svg>
          <span class="title">每天提醒计划</span>
        </div>
        <div class="btn" @click="weekReport">
          <svg class="week" t="1686149064660" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="47866" width="16" height="16"><path d="M1000.727273 709.818182q0 7.144727-0.349091 14.266182-0.349091 7.144727-1.047273 14.242909-0.698182 7.121455-1.745454 14.196363-1.047273 7.051636-2.443637 14.056728-1.396364 6.981818-3.141818 13.917091-1.722182 6.935273-3.793455 13.777454-2.094545 6.818909-4.491636 13.544727-2.397091 6.725818-5.12 13.335273-2.746182 6.586182-5.818182 13.032727-3.025455 6.469818-6.4 12.753455-3.374545 6.306909-7.028363 12.427636-3.677091 6.120727-7.656728 12.078546-3.956364 5.934545-8.215272 11.659636-4.258909 5.748364-8.773819 11.264-4.538182 5.515636-9.332363 10.821818-4.794182 5.282909-9.844364 10.333091t-10.333091 9.844364q-5.306182 4.794182-10.821818 9.309091-5.515636 4.538182-11.264 8.797091-5.725091 4.258909-11.659636 8.215272-5.957818 3.956364-12.078546 7.656728-6.120727 3.653818-12.427636 7.028363-6.283636 3.374545-12.753455 6.423273-6.446545 3.048727-13.032727 5.794909-6.609455 2.722909-13.335273 5.12-6.725818 2.420364-13.544727 4.491636-6.842182 2.071273-13.777454 3.793455-6.912 1.745455-13.917091 3.141818-7.005091 1.396364-14.08 2.443637-7.051636 1.047273-14.173091 1.745454-7.098182 0.698182-14.242909 1.047273-7.121455 0.349091-14.266182 0.349091t-14.266182-0.349091q-7.144727-0.349091-14.242909-1.047273-7.121455-0.698182-14.196364-1.745454-7.051636-1.047273-14.056727-2.443637-6.981818-1.396364-13.917091-3.141818-6.935273-1.722182-13.777454-3.793455-6.818909-2.094545-13.544728-4.491636-6.725818-2.397091-13.335272-5.12-6.586182-2.746182-13.032728-5.818182-6.469818-3.025455-12.753454-6.4-6.306909-3.374545-12.427637-7.028363-6.120727-3.677091-12.078545-7.656728-5.934545-3.956364-11.659636-8.215272-5.748364-4.258909-11.264-8.773819-5.515636-4.538182-10.798546-9.332363-5.306182-4.794182-10.356364-9.844364t-9.844363-10.333091q-4.794182-5.306182-9.309091-10.821818-4.538182-5.515636-8.797091-11.264-4.258909-5.725091-8.215273-11.659636-3.956364-5.957818-7.656727-12.078546-3.653818-6.120727-7.028364-12.427636-3.374545-6.283636-6.423272-12.753455-3.048727-6.446545-5.771637-13.032727-2.746182-6.609455-5.143272-13.335273-2.420364-6.725818-4.491637-13.544727-2.071273-6.842182-3.793454-13.777454-1.745455-6.912-3.141819-13.917091-1.396364-7.005091-2.443636-14.08-1.047273-7.051636-1.745454-14.173091-0.698182-7.098182-1.047273-14.242909Q418.909091 716.962909 418.909091 709.818182t0.349091-14.266182q0.349091-7.144727 1.047273-14.242909 0.698182-7.121455 1.745454-14.196364 1.047273-7.051636 2.443636-14.056727 1.396364-6.981818 3.141819-13.917091 1.722182-6.935273 3.793454-13.777454 2.094545-6.818909 4.491637-13.544728 2.397091-6.725818 5.12-13.335272 2.746182-6.586182 5.818181-13.032728 3.025455-6.469818 6.4-12.753454 3.374545-6.306909 7.028364-12.427637 3.677091-6.120727 7.656727-12.078545 3.956364-5.934545 8.215273-11.659636 4.258909-5.748364 8.773818-11.264 4.538182-5.515636 9.332364-10.798546 4.794182-5.306182 9.844363-10.356364t10.356364-9.844363q5.282909-4.794182 10.798546-9.309091 5.515636-4.538182 11.264-8.797091 5.725091-4.258909 11.659636-8.215273 5.957818-3.956364 12.078545-7.656727 6.120727-3.653818 12.427637-7.028364 6.283636-3.374545 12.753454-6.423272 6.446545-3.048727 13.032728-5.771637 6.609455-2.746182 13.335272-5.143272 6.725818-2.420364 13.544728-4.491637 6.842182-2.071273 13.777454-3.793454 6.912-1.745455 13.917091-3.141819 7.005091-1.396364 14.08-2.443636 7.051636-1.047273 14.173091-1.745454 7.098182-0.698182 14.242909-1.047273 7.121455-0.349091 14.266182-0.349091t14.266182 0.349091q7.144727 0.349091 14.242909 1.047273 7.121455 0.698182 14.196363 1.745454 7.051636 1.047273 14.056728 2.443636 6.981818 1.396364 13.917091 3.141819 6.935273 1.722182 13.777454 3.793454 6.818909 2.094545 13.544727 4.491637 6.725818 2.397091 13.335273 5.12 6.586182 2.746182 13.032727 5.818181 6.469818 3.025455 12.753455 6.4 6.306909 3.374545 12.427636 7.028364 6.120727 3.677091 12.078546 7.656727 5.934545 3.956364 11.659636 8.215273 5.748364 4.258909 11.264 8.773818 5.515636 4.538182 10.821818 9.332364 5.282909 4.794182 10.333091 9.844363t9.844364 10.356364q4.794182 5.282909 9.309091 10.798546 4.538182 5.515636 8.797091 11.264 4.258909 5.725091 8.215272 11.659636 3.956364 5.957818 7.656728 12.078545 3.653818 6.120727 7.028363 12.427637 3.374545 6.283636 6.423273 12.753454 3.048727 6.446545 5.794909 13.032728 2.722909 6.609455 5.12 13.335272 2.420364 6.725818 4.491636 13.544728 2.071273 6.842182 3.793455 13.777454 1.745455 6.912 3.141818 13.917091 1.396364 7.005091 2.443637 14.08 1.047273 7.051636 1.745454 14.173091 0.698182 7.098182 1.047273 14.242909 0.349091 7.121455 0.349091 14.266182z" fill="#FFDEBB" p-id="47867"></path><path d="M796.299636 78.126545h58.973091c78.848 0 145.454545 67.118545 145.454546 146.571637v652.753454C1000.727273 956.881455 934.120727 1024 855.272727 1024H168.727273C89.856 1024 23.272727 956.881455 23.272727 877.451636V224.698182C23.272727 145.221818 89.879273 78.126545 168.727273 78.126545h58.973091V47.36C227.700364 21.294545 248.832 0 274.688 0c25.832727 0 46.987636 21.294545 46.987636 47.36v30.766545h380.648728V47.36c0-26.065455 21.154909-47.36 46.987636-47.36s47.010909 21.294545 47.010909 47.36v30.766545z m68.375273 850.920728c21.038545 0 41.821091-20.829091 41.821091-42.123637V215.202909c0-21.178182-20.666182-42.146909-41.821091-42.146909h-68.375273v35.281455a47.313455 47.313455 0 0 1-47.010909 47.336727c-25.832727 0-46.987636-21.294545-46.987636-47.336727V173.079273H321.675636v35.281454a47.313455 47.313455 0 0 1-47.010909 47.336728c-25.832727 0-46.987636-21.294545-46.987636-47.336728V173.079273H159.325091c-21.178182 0-41.844364 20.829091-41.844364 42.123636V886.923636c0 21.317818 20.689455 42.146909 41.844364 42.146909h705.349818z" fill="#86BC9F" p-id="47868"></path><path d="M601.460364 372.363636h-211.921455C364.567273 372.363636 349.090909 386.373818 349.090909 408.948364c0 22.597818 15.476364 36.608 40.448 36.608h169.565091c-5.282909 28.951273-30.487273 61.067636-57.018182 94.952727-39.098182 49.896727-83.502545 106.612364-83.502545 173.568 0 14.708364 2.024727 35.653818 11.636363 52.48 9.239273 16.244364 23.505455 24.715636 41.518546 24.715636 23.272727 0 42.24-19.060364 42.24-42.472727 0-9.658182-0.605091-17.780364-0.930909-24.832-0.395636-6.004364-0.861091-11.776-0.861091-17.640727-0.232727-35.560727 28.928-74.496 59.880727-115.665455C609.396364 540.951273 651.636364 484.608 651.636364 421.282909 651.52 386.141091 637.463273 372.363636 601.460364 372.363636z" fill="#86BC9F" p-id="47869"></path></svg>
          <span class="title">生成周报</span>
        </div>
        <div @click="switchMode" class="mode">
          <svg v-if="mode" class="dark" t="1686150160856" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="49091" width="20" height="20"><path d="M475.306667 856.746667a349.110857 349.110857 0 0 0 73.386666 0.341333V999.619048h-73.386666v-142.872381z m306.95619-126.342096l100.473905 100.449524-51.882667 51.882667-100.449524-100.449524a347.37981 347.37981 0 0 0 51.882667-51.882667z m-538.819047-1.706666a347.37981 347.37981 0 0 0 51.565714 52.175238l-101.863619 101.863619-51.882667-51.882667 102.180572-102.15619zM513.560381 225.792c158.915048 0 287.744 128.828952 287.744 287.744s-128.828952 287.744-287.744 287.744S225.816381 672.475429 225.816381 513.560381 354.645333 225.816381 513.560381 225.816381z m0 73.386667a214.381714 214.381714 0 1 0 0 428.714666 214.381714 214.381714 0 0 0 0-428.739047zM999.619048 475.282286v73.386666h-142.531048a349.379048 349.379048 0 0 0-0.341333-73.386666H999.619048z m-829.269334 0a349.110857 349.110857 0 0 0-0.316952 73.386666H24.380952v-73.386666h145.968762z m22.796191-334.043429l103.570285 103.545905a347.37981 347.37981 0 0 0-51.907047 51.907048L141.263238 193.145905l51.882667-51.882667z m637.70819 0l51.882667 51.882667L780.921905 295.009524a347.37981 347.37981 0 0 0-52.224-51.565714l102.180571-102.180572zM548.693333 24.380952v145.65181a349.379048 349.379048 0 0 0-73.386666 0.316952V24.380952h73.386666z" p-id="49092"></path></svg>
          <svg v-else class="light" t="1686150199388" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="50233" width="20" height="20"><path d="M428.624 226.64a236.288 236.288 0 0 0-5.04 48.672c0 128.48 102.928 232.64 229.888 232.64 55.264 0 105.968-19.712 145.632-52.608 13.632-11.312 44.16-6.96 46.192 9.312 1.792 14.176 2.704 28.64 2.704 43.312C848 695.76 697.568 848 512 848s-336-152.24-336-340.032c0-140.576 84.288-261.216 204.512-313.008 20.912-9.008 51.952 13.392 48.112 31.68z m-57.808 32.832l-0.288 0.176c-86.08 50.432-141.328 144.176-141.328 248.32 0 158.448 126.72 286.688 282.8 286.688 149.12 0 271.44-117.072 282.048-265.696l0.32-5.552-5.632 3.2a279.808 279.808 0 0 1-128.416 34.624l-6.848 0.08c-156.464 0-283.104-128.16-283.104-286 0-2.88 0.048-5.76 0.128-8.64l0.32-7.2z m393.824-67.408a16 16 0 0 1 16 16v21.216a15.936 15.936 0 0 1-1.648 7.072 15.872 15.872 0 0 1-4.8 8.064l-113.344 102.288h103.792a16 16 0 0 1 16 16v21.216a16 16 0 0 1-16 16H588.192a16 16 0 0 1-16-16V362.72c0-3.936 1.408-7.536 3.76-10.32 0.752-1.12 1.648-2.192 2.704-3.152l115.184-103.984h-105.648a16 16 0 0 1-16-16v-21.2a16 16 0 0 1 16-16H764.64z" p-id="50234"></path></svg>
        </div>
      </div>
      <el-tree
        ref="treeEl"
        :data="dataSource"
        show-checkbox
        node-key="id"
        default-expand-all
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span @click="view(node, data)">
              <span v-if="!data.children" class="am">
                <svg v-if="data.isAm" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="#ff7575" stroke-dasharray="2" stroke-dashoffset="2" stroke-linecap="round" stroke-width="2"><path d="M0 0"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="2;0"/></path><path d="M0 0"><animate fill="freeze" attributeName="d" begin="0.9s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="1.2s" values="2;0"/></path><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g><mask id="lineMdMoonFilledAltToSunnyFilledLoopTransition0"><circle cx="12" cy="12" r="12" fill="#fff"/><circle cx="18" cy="6" r="12" fill="#fff"><animate fill="freeze" attributeName="cx" dur="0.4s" values="18;22"/><animate fill="freeze" attributeName="cy" dur="0.4s" values="6;2"/><animate fill="freeze" attributeName="r" dur="0.4s" values="12;3"/></circle><circle cx="18" cy="6" r="10"><animate fill="freeze" attributeName="cx" dur="0.4s" values="18;22"/><animate fill="freeze" attributeName="cy" dur="0.4s" values="6;2"/><animate fill="freeze" attributeName="r" dur="0.4s" values="10;1"/></circle></mask><circle cx="12" cy="12" r="10" fill="#ff7575" mask="url(#lineMdMoonFilledAltToSunnyFilledLoopTransition0)"><animate fill="freeze" attributeName="r" dur="0.4s" values="10;6"/></circle></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="rgb(77, 77, 40)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><g stroke-dasharray="2"><path d="M12 21v1M21 12h1M12 3v-1M3 12h-1"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="4;2"/></path><path d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="4;2"/></path></g><path fill="rgb(77, 77, 40)" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z" opacity="0"><set attributeName="opacity" begin="0.5s" to="1"/></path></g><g fill="rgb(77, 77, 40)" fill-opacity="0"><path d="m15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z"><animate id="lineMdSunnyFilledLoopToMoonFilledLoopTransition0" fill="freeze" attributeName="fill-opacity" begin="0.6s;lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+6s" dur="0.4s" values="0;1"/><animate fill="freeze" attributeName="fill-opacity" begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+2.2s" dur="0.4s" values="1;0"/></path><path d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+3s" dur="0.4s" values="0;1"/><animate fill="freeze" attributeName="fill-opacity" begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+5.2s" dur="0.4s" values="1;0"/></path><path d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+0.4s" dur="0.4s" values="0;1"/><animate fill="freeze" attributeName="fill-opacity" begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+2.8s" dur="0.4s" values="1;0"/></path><path d="m20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+3.4s" dur="0.4s" values="0;1"/><animate fill="freeze" attributeName="fill-opacity" begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+5.6s" dur="0.4s" values="1;0"/></path></g><mask id="lineMdSunnyFilledLoopToMoonFilledLoopTransition1"><circle cx="12" cy="12" r="12" fill="#fff"/><circle cx="22" cy="2" r="3" fill="#fff"><animate fill="freeze" attributeName="cx" begin="0.1s" dur="0.4s" values="22;18"/><animate fill="freeze" attributeName="cy" begin="0.1s" dur="0.4s" values="2;6"/><animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="3;12"/></circle><circle cx="22" cy="2" r="1"><animate fill="freeze" attributeName="cx" begin="0.1s" dur="0.4s" values="22;18"/><animate fill="freeze" attributeName="cy" begin="0.1s" dur="0.4s" values="2;6"/><animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="1;10"/></circle></mask><circle cx="12" cy="12" r="6" fill="rgb(77, 77, 40)" mask="url(#lineMdSunnyFilledLoopToMoonFilledLoopTransition1)"><set attributeName="opacity" begin="0.5s" to="0"/><animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="6;10"/></circle></svg>
              </span>
              <span :style="{maxWidth}" class="label">{{ data.children ? data.label : getTitle(data) }}</span>
            </span>
            <span v-if="data.children" @click="(e) => dayReport(e,node,data)">
              <svg class="day" t="1686147022790" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27411" width="16" height="16"><path d="M799.33855801 961.96250762H226.64877646C132.68160635 961.96250762 62.03749238 886.18132198 62.03749238 792.25164864V280.19431513c0-93.96717012 70.64411396-169.71085898 164.61128408-166.71110976a30.37246963 30.37246963 0 0 1 30.33497198 30.37246963c0 15.03624727-12.1489875 33.82218193-30.33497198 33.82218193-57.59520117 0-101.01658271 44.92125703-101.01658359 102.5164582v509.02008662c0 57.59520117 43.42138242 108.51595839 101.01658359 108.51595841h572.68978154c57.59520117 0 98.20431739-50.92075723 98.20431739-108.51595841V277.15706739c0-60.59495127-40.60911621-102.47896143-98.20431739-102.47896056h-18.18598446c-15.18623438 0-30.33497198-15.67369424-30.33497286-33.85967871a30.37246963 30.37246963 0 0 1 30.33497286-30.33497285h18.18598446c90.96742002 0 162.81143437 75.74368886 162.69894317 169.71085986v512.0573335c0 93.92967334-68.73177305 169.71085898-162.69894317 169.71085898zM687.29789375 207.45037636c-15.18623438 0-30.33497198-9.1492374-30.33497285-24.22298232V86.26047383c0-12.1489875 12.1489875-24.22298145 30.33497285-24.22298145 18.18598448 0 30.33497198 9.03674707 30.33497198 24.22298145v96.96692021c0 12.03649717-12.1489875 24.22298145-30.33497198 24.22298233z m-16.87359375 127.30189219v427.12691046c0 9.37421895-6.22448174 15.56120302-15.56120391 15.5612039h-15.5986998c-9.33672217 0-15.56120302-6.18698408-15.5612039-15.5612039v-28.01016563H399.17190078v28.01016563c0 9.37421895-6.22448174 15.56120302-15.56120302 15.5612039h-15.56120303c-9.37421895 0-15.59870068-6.18698408-15.59870069-15.5612039V334.75226855c0-9.33672217 6.22448174-15.59870068 15.59870069-15.5986998h286.81360136c9.33672217 0 15.56120302 6.26197852 15.56120391 15.59869981zM623.59070205 374.01149727H405.4338793v127.33938984h218.15682275V374.01149727z m0 175.74785683H405.4338793v133.33888916h218.15682275v-133.33888916zM596.36797051 174.07815664H414.5831167c-12.18648427 0-24.22298145-12.03649717-27.26022832-30.33497197 0-15.18623438 12.07399394-30.33497198 27.26022832-30.33497285h181.78485381c15.07374404 0 27.22273154 12.1489875 27.22273154 30.33497285 0 15.1487376-12.07399394 30.33497198-27.22273154 30.33497197z m-272.75227383 33.37221972c-15.18623438 0-30.25997842-9.1492374-30.33497197-24.22298232V86.26047383c0-12.07399394 12.1489875-24.22298145 30.33497196-24.22298145 15.18623438 0 30.33497198 9.03674707 30.33497286 24.22298145v96.96692021c0 12.03649717-12.1489875 24.22298145-30.33497286 24.22298233z" p-id="27412"></path></svg>
            </span>
            <span v-else >
              <svg class="edit" @click="update(node,data)" t="1686146937648" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26051" width="16" height="16"><path d="M827.733333 313.173333L710.826667 196.266667A85.333333 85.333333 0 0 0 597.333333 193.28l-384 384a85.333333 85.333333 0 0 0-24.32 51.626667L170.666667 806.826667a42.666667 42.666667 0 0 0 12.373333 34.133333A42.666667 42.666667 0 0 0 213.333333 853.333333h3.84l177.92-16.213333a85.333333 85.333333 0 0 0 51.626667-24.32l384-384a81.92 81.92 0 0 0-2.986667-115.626667zM387.413333 751.786667l-128 11.946666 11.52-128L512 397.653333l115.2 115.2zM682.666667 455.68L568.32 341.333333l83.2-85.333333L768 372.48z"  p-id="26052"></path></svg>
              <svg class="remove" @click="remove(node,data)" t="1686146727547" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13871" width="16" height="16"><path d="M270.634667 632.661333l-22.613334-22.613333 22.613334 22.613333z m120.704 120.704l22.613333 22.613334-22.613333-22.613334z m241.322666-482.730666l-22.613333-22.613334 22.613333 22.613334z m-241.322666 0l22.613333-22.613334-22.613333 22.613334zM270.634667 391.338667l22.613333-22.613334-22.613333 22.613334z m482.730666 241.322666l22.613334-22.613333-22.613334 22.613333zM632.661333 512l-22.613333-22.613333a32 32 0 0 0 0 45.226666l22.613333-22.613333zM512 632.661333l22.613333-22.613333a32 32 0 0 0-45.226666 0l22.613333 22.613333zM391.338667 512l22.613333 22.613333a32 32 0 0 0 0-45.226666l-22.613333 22.613333zM512 391.338667l-22.613333 22.613333a32 32 0 0 0 45.226666 0l-22.613333-22.613333z m-218.752 339.413333a53.333333 53.333333 0 0 1 0-75.434667l-45.226667-45.226666a117.333333 117.333333 0 0 0 0 165.888l45.226667-45.226667z m75.434667 0a53.333333 53.333333 0 0 1-75.434667 0l-45.226667 45.226667a117.333333 117.333333 0 0 0 165.930667 0l-45.226667-45.226667z m362.069333-437.504a53.333333 53.333333 0 0 1 0 75.434667l45.226667 45.226666a117.333333 117.333333 0 0 0 0-165.888l-45.226667 45.226667z m45.226667-45.226667a117.333333 117.333333 0 0 0-165.930667 0l45.226667 45.226667a53.333333 53.333333 0 0 1 75.477333 0l45.226667-45.226667zM293.248 293.248a53.333333 53.333333 0 0 1 75.434667 0l45.226666-45.226667a117.333333 117.333333 0 0 0-165.888 0l45.226667 45.226667z m0 75.434667a53.333333 53.333333 0 0 1 0-75.434667l-45.226667-45.226667a117.333333 117.333333 0 0 0 0 165.930667l45.226667-45.226667z m437.504 362.069333a53.333333 53.333333 0 0 1-75.434667 0l-45.226666 45.226667a117.333333 117.333333 0 0 0 165.888 0l-45.226667-45.226667z m45.226667 45.226667a117.333333 117.333333 0 0 0 0-165.930667l-45.226667 45.226667a53.333333 53.333333 0 0 1 0 75.477333l45.226667 45.226667z m-165.930667-241.365334l120.704 120.704 45.226667-45.226666-120.661334-120.746667-45.226666 45.269333z m120.704-165.930666l-120.704 120.704 45.226667 45.226666 120.746666-120.661333-45.269333-45.226667z m-241.365333 241.365333L368.64 730.752l45.226667 45.226667 120.746666-120.661334-45.269333-45.226666z m165.930666 120.704l-120.704-120.704-45.226666 45.226667 120.661333 120.746666 45.226667-45.269333zM413.952 489.386667L293.248 368.64l-45.226667 45.226667 120.661334 120.746666 45.226666-45.269333z m-120.704 165.930666l120.704-120.704-45.226667-45.226666-120.746666 120.661333 45.269333 45.226667z m75.434667-362.069333l120.704 120.704 45.226666-45.226667-120.661333-120.746666-45.226667 45.269333z m241.365333-45.226667L489.386667 368.64l45.226666 45.226667 120.704-120.661334-45.226666-45.226666z" p-id="13872"></path></svg>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>`
}
