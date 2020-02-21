<template>
    <div class="calendar">
        <div id="calendar">
            <div class="month">
                <ul>
                    <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
                    <li class="year-month">
                        {{ currentYear }} {{ currentMonth }}月
                    </li>
                    <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
                </ul>
            </div>
            <ul class="weekdays">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li>六</li>
                <li>日</li>
            </ul>
            <ul class="days">
                <li :class="{blue:i===index}" v-for="(item, index) in selfDays" :key="index">
                    <!-- <div v-if="item.y >= new Date().getFullYear() && item.m >= new Date().getMonth()" @click="pick(item.day, index)"> -->
                    <div v-if="item.str >= today" @click="pick(item.day, index)">
                        <span v-if="item.m + 1 != currentMonth" class="other-month">
                            <span class="date-tag">{{item.d}}</span><span :class="{red:item.full}">-人</span>
                        </span>
                        <div v-else>
                            <span v-if="item.y == new Date().getFullYear() && item.m == new Date().getMonth() && item.d == new Date().getDate()">
                                <span class="date-tag active">{{item.d}}</span><span :class="{red:item.full}">{{item.num}}人</span>
                            </span>
                            <span v-else>
                                <span class="date-tag">{{item.d}}</span><span :class="{red:item.full}">{{item.num}}人</span>
                            </span>
                        </div>
                    </div>
                    <div v-else>
                        <span v-if="item.m + 1 != currentMonth" class="other-month">
                            <span class="date-tag">{{item.d}}</span><span :class="{red:item.full}">-人</span>
                        </span>
                        <div v-else>
                            <span style="color: #666">
                                <span class="date-tag">{{item.d}}</span><span :class="{red:item.full}">{{item.num}}人</span>
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import commonService from '@services/commonService'
import patientService from '@services/patientService'
import Popup from '@modules/Popup'
import Utils from '@modules/Utils';
export default {
    name: 'calendar',
    props: {
        calIndex: String
    },
    data() {
        return {
            currentDay: 1,
            currentMonth: 1,
            currentYear: 1970,
            currentWeek: 1,
            days: [],
            selfDays: [],
            dataArr: [],
            i: this.calIndex,
            today: ''
        }
    },
    created() {
        let date = new Date()
        this.today = this.formatStringTime(this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate()))
        this.initData(this.formatDate(date.getFullYear(), date.getMonth() + 1, 1))
        this.getDateNumberList(this.formatDate(date.getFullYear(), date.getMonth() + 1, 1))
    },
    methods: {
        // 获取预约人数
        getDateNumberList(date) {
            let _data = {
                applyDate: this.formatDateFun(date)
            }
            patientService.getDateNumberList(_data).then(data => {
                data || (data = {})
                if (data['code'] != commonService.STATUS_SUCCESS) {
                    commonService.Warning(data['code'], data['msg'])
                    return data
                }
                this.dataArr = data.object
                this.initData(date);
            }, error => {
                Popup.hideLoading()
                patientService.NetWorkFail()
            })
        },
        initData: function(cur) {
            this.selfDays = []
            var date;
            if (cur) {
                date = new Date(cur);
            } else {
                date = new Date();
            }
            this.currentDay = date.getDate();
            this.currentYear = date.getFullYear();
            this.currentMonth = date.getMonth() + 1;
            this.currentWeek = date.getDay(); // 1...6,0
            if (this.currentWeek == 0) {
                this.currentWeek = 7;
            }
            let str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);
            this.days.length = 0;
            this.selfDays.length = 0;
            // 今天是周日，放在第一行第7个位置，前面6个
            for (let i = this.currentWeek - 1; i >= 0; i--) {
                let d = new Date(str);
                d.setDate(d.getDate() - i);
                this.days.push(d);
                let day = this.formatDateFun(d)
                let num = this.getNum(day)
                if (num.length > 0) {
                    this.selfDays.push({'day': day, 'num': num[0].number, 'y': d.getFullYear(), 'm': d.getMonth(), 'd': d.getDate(), 'str': this.formatStringTime(day)})
                } else {
                    this.selfDays.push({'day': day, 'num': '0', 'y': d.getFullYear(), 'm': d.getMonth(), 'd': d.getDate(), 'str': this.formatStringTime(day)})
                }
            }
            for (let i = 1; i <= 35 - this.currentWeek; i++) {
                let d = new Date(str);
                d.setDate(d.getDate() + i);
                this.days.push(d);
                let day = this.formatDateFun(d)
                let num = this.getNum(day)
                if (num.length > 0) {
                    this.selfDays.push({'day': day, 'num': num[0].number, 'y': d.getFullYear(), 'm': d.getMonth(), 'd': d.getDate(), 'str': this.formatStringTime(day)})
                } else {
                    this.selfDays.push({'day': day, 'num': '0', 'y': d.getFullYear(), 'm': d.getMonth(), 'd': d.getDate(), 'str': this.formatStringTime(day)})
                }
            }
        },
        // 选择日期
        pick: function(date, index) {
            this.i = index
            this.$emit('calendarDate', date)
            // console.log(this.formatDate( date.getFullYear() , date.getMonth() + 1, date.getDate()));
        },
        // 上个月
        pickPre: function(year, month) {
            // setDate(0); 上月最后一天
            // setDate(-1); 上月倒数第二天
            // setDate(dx) 参数dx为 上月最后一天的前后dx天
            this.i = ''
            let d = new Date(this.formatDate(year, month, 1));
            d.setDate(0);
            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
            this.getDateNumberList(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
            this.$emit('calendarMonth', this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
        },
        // 下个月
        pickNext: function(year, month) {
            this.i = ''
            let d = new Date(this.formatDate(year, month, 1));
            d.setDate(35);
            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
            this.getDateNumberList(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
            this.$emit('calendarMonth', this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
        },
        pickYear: function(year, month) {
            alert(year + ',' + month);
        },
        // 返回 类似 2016-01-02 格式的字符串
        formatDate: function(year, month, day){
            var y = year;
            var m = month;
            if (m < 10) m = '0' + m;
                var d = day;
            if (d < 10) d = '0' + d;
                return y + '-' + m + '-' + d
        },
        // 格式化日期 YY-MM-DD
        formatDateFun: function(cur){
            var date;
            if (cur) {
                date = new Date(cur);
            } else {
                date = new Date();
            }
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            if (m < 10) m = '0' + m;
                var d = date.getDate();
            if (d < 10) d = '0' + d;
                return y + '-' + m + '-' + d
        },
        getNum: function(viewDate) {
            let obj = this.dataArr.filter(function(item){
                if (item.date == viewDate) {
                    return item
                }
            })
            return obj
        },
        clearI: function() {
            this.i = ''
        },
        formatStringTime: function (stringTime) {
            stringTime = new Date(Date.parse(stringTime.replace(/-/g, '/')));
            return stringTime.getTime();
        }
    }
}
</script>
<style lang="scss" scoped>
#calendar{
    width:100%;
    margin: 0 auto;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.1), 0 1px 5px 0 rgba(0,0,0,0.12);
}
.month {
    width: 100%;
    background: #3394f5;
}
.month ul {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    line-height: 36px;
}
.month ul li {
    color: white;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 3px;
}
.year-month {
    align-items: center;
    justify-content: space-around;
}
.choose-year {
    padding-left: 20px;
    padding-right: 20px;
}
.choose-month {
    text-align: center;
    font-size: 20px;
}
.arrow {
    padding:0px 20px;
    cursor: pointer;
}
.arrow:hover {
    background: rgba(100, 2, 12, 0.1);
}
.weekdays {
    background-color: #3394f5;
    display: flex;
    flex-wrap: wrap;
    color: #FFFFFF;
    justify-content: space-around;
    font-size: 14px;
}
.weekdays li {
    display: inline-block;
    width: 13.6%;
    text-align: center;
    line-height: 25px;
}
.days {
    padding: 0;
    background: #FFFFFF;
    margin: 0;
    border-left: 1px solid #eee;
    border-top: 1px solid #eee;
    width: 100%;
    overflow: hidden;
}
.days li {
    position: relative;
    list-style-type: none;
    float: left;
    width: 14.28%;
    text-align: center;
    font-size: 12px;
    color: #000;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    cursor: default;
    height: 43px;
    line-height: 65px;
}
.days li.blue{
    position: relative;
    left:-1px;
    top: -1px;
    z-index: 1;
    border: 1px solid #3394f5;
}
.days li .date-tag{
    position: absolute;
    left: 0;
    top: 0;
    width: 26px;
    height: 26px;
    line-height: 26px;
}
.days li .active {
    border-radius: 50%;
    background: #3394f5;
    color: #fff;
}
.days li .other-month {
    padding: 5px;
    color: gainsboro;
}
.red{
    color: red;
}
</style>